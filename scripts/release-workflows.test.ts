import { describe, expect, test } from "bun:test";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";

const load = (name: string): any =>
  Bun.YAML.parse(readFileSync(new URL(`../.github/workflows/${name}.yml`, import.meta.url), "utf8"));
const preview = load("preview");
const release = load("release");
const adminGate = release.jobs["validate-release-source"].steps[0];

describe("official publishing workflow boundaries", () => {
  test("publishing is tag-only while normal PR CI remains enabled", () => {
    expect(preview.on).toEqual({ push: { tags: ["preview-*"] } });
    expect(release.on).toEqual({ push: { tags: ["v*"] } });
    expect(load("ci").on.pull_request).toBeDefined();
  });

  test("preview checks do not require a workstation Windows SDK", () => {
    const checks = preview.jobs.preflight.steps.find((step: any) => step.name === "Run checks");
    expect(checks.run.trim().split("\n")).toEqual(["just ci", "just docs-contract-test"]);
    expect(preview.jobs.build.strategy.matrix.include).toContainEqual({
      target: "x86_64-pc-windows-msvc",
      os: "windows-latest",
      name: "herdr-windows-x86_64.zip",
    });
    expect(preview.jobs.publish.needs).toContain("build");
  });

  test("manual artifacts require Linux checks before any platform build", () => {
    const manual = load("build-artifacts-manual");
    const verify = manual.jobs["verify-linux"];
    expect(verify["runs-on"]).toBe("ubuntu-latest");
    expect(verify.steps.some((step: any) => step.uses?.startsWith("actions/checkout@"))).toBe(true);
    expect(verify.steps.some((step: any) => step.uses?.startsWith("dtolnay/rust-toolchain@"))).toBe(true);
    expect(verify.steps.some((step: any) => step.uses?.startsWith("taiki-e/install-action@"))).toBe(true);
    expect(verify.steps.some((step: any) => step.uses?.startsWith("oven-sh/setup-bun@"))).toBe(true);
    expect(verify.steps.some((step: any) => step.uses?.startsWith("vercel-labs/setup-zig@"))).toBe(true);
    expect(verify.steps.filter((step: any) => step.run).map((step: any) => step.run.trim())).toContain("CARGO_INCREMENTAL=1 just ci");
    expect(verify.steps.filter((step: any) => step.run).map((step: any) => step.run.trim())).toContain("just docs-contract-test");
    expect(verify["continue-on-error"] ?? false).toBe(false);
    for (const step of verify.steps) {
      expect(step["continue-on-error"] ?? false).toBe(false);
    }
    for (const platform of ["linux", "macos", "windows"]) {
      const build = manual.jobs[`build-${platform}`];
      expect(build.needs).toBe("verify-linux");
      expect(build.if).not.toContain("always()");
      expect(build["continue-on-error"] ?? false).toBe(false);
    }
  });

  test("manual artifact selection still retains every existing build group", () => {
    const manual = load("build-artifacts-manual");
    expect(manual.on.workflow_dispatch.inputs.build_group.options).toEqual(["linux", "macos", "windows", "all"]);
    for (const platform of ["linux", "macos", "windows"]) {
      expect(manual.jobs[`build-${platform}`].if).toContain(`inputs.build_group == '${platform}'`);
      expect(manual.jobs[`build-${platform}`].if).toContain("inputs.build_group == 'all'");
    }
  });

  test("each publishing job rechecks both actors before using credentials", () => {
    for (const [workflow, names] of [
      [preview, ["preflight", "publish"]],
      [release, ["validate-release-source", "release", "update-nix-package", "close-released-issues", "update-latest-json"]],
    ] as const) {
      for (const name of names) {
        const job = workflow.jobs[name];
        expect(job.if).toContain("github.event_name == 'push'");
        expect(job.if).toContain("startsWith(github.ref, 'refs/tags/");
        expect(job.steps[0]).toEqual(adminGate);
      }
    }
    expect(adminGate.run).toContain('"$GITHUB_ACTOR" "$GITHUB_TRIGGERING_ACTOR"');
    expect(adminGate.env.GH_TOKEN).toBe("${{ github.token }}");
    expect(adminGate.run).not.toContain("ogulcancelik");
  });

  test("release arguments are not interpolated into executable shell text", () => {
    const input = `untrusted'\"$(echo unexpected-command)`;
    for (const args of [
      ["preview", input],
      ["release-prepare", input, input],
      ["release-publish", input, input],
      ["release", input, input],
    ]) {
      const result = spawnSync("just", ["--dry-run", ...args], { encoding: "utf8" });
      expect(result.status).toBe(0);
      expect(result.stdout + result.stderr).not.toContain(input);
      expect(result.stdout + result.stderr).not.toContain("unexpected-command");
    }
  });

  test.skipIf(process.platform === "win32")("admin gate permits admins and fails closed for other roles or API errors", () => {
    const dir = mkdtempSync("/var/tmp/herdr-admin-gate-");
    try {
      writeFileSync(join(dir, "gh"), `#!/bin/sh
case "$2" in
  */collaborators/admin-*/permission) echo admin ;;
  */collaborators/maintainer/permission) echo maintain ;;
  */collaborators/writer/permission) echo write ;;
  *) exit 1 ;;
esac
`, { mode: 0o755 });
      for (const [actor, trigger, succeeds] of [
        ["admin-one", "admin-two", true],
        ["writer", "admin-two", false],
        ["admin-one", "writer", false],
        ["admin-one", "maintainer", false],
        ["admin-one", "api-error", false],
      ] as const) {
        const result = spawnSync("bash", ["-c", adminGate.run], {
          env: { ...process.env, PATH: `${dir}:${process.env.PATH}`, GITHUB_REPOSITORY: "example/test", GITHUB_ACTOR: actor, GITHUB_TRIGGERING_ACTOR: trigger },
          encoding: "utf8",
        });
        expect(result.status === 0).toBe(succeeds);
      }
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
