# Personal fork remote release flow
Candidate: `feat/navigation-release-flow` in the linked upstream-based worktree. Destination: `github.com/Andiveli/herdr`.
Status: authorized implementation; no commit, push, default-branch change, dispatch, or installation completed for this flow.

## Specs
- S1: «flujo sin tanto que hacer»
- S2: «en una futura release de upstream, hacemos el merge»
- S3: «en github todo lo que requiera recursos de la maquina»
- S4: «luego instalo»
- S5: «Sí, hagamoslo así»

## Tasks
- T1 [S1, S3, S5] [in_progress: bounded work-unit commit; remote proof after publication] Add a meaningful manual-dispatch test gate before artifact builds, with workflow contract tests and focused documentation; route: inline (one coupled workflow/test unit), independent verification because CI/delivery is high risk; commit: pending explicit authorization and verification.
- T2 [S1, S2, S3] [pending: local branch created; publish after work-unit checks] Preserve unrelated work in both worktrees, reconcile local and fork refs, confirm the fork default branch already has the manual dispatch, then publish a new candidate branch without changing the default branch; route: parent Git incident analysis and separate delivery authorization; commit: pending explicit authorization and checks.
- T3 [S1, S3, S4] Dispatch the selected published commit on GitHub, require the recorded tests to pass before treating the artifact as installable, verify exact commit/architecture/SHA-256, and install with a backup; route: parent with separate delivery authorization; commit: not applicable to artifact installation.

## Log
- L1 (user, verbatim): «Vería eso, porque quiero que sea un flujo sin tanto que hacer, digamos en una futura release de upstream, hacemos el merge, y hacemos en github todo lo que requiera recursos de la maquina, así yo puedo dedicar mis recursos a otra cosa ya que voy limitado, y luego instalo. Hay forma de que sea un flujo fluido ?»
- L2 (user, verbatim): «Sí, hagamoslo así»
- L3 (evidence): The existing `.github/workflows/build-artifacts-manual.yml` dispatches builds but runs no tests; `.github/workflows/ci.yml` has a Linux test path. The previous serial suite passed 3965 of 3966 tests with one SIGHUP shutdown-log failure; this is not a green release gate. The main checkout is detached and dirty, while the candidate also contains unrelated changes. No local Cargo builds or tests are planned.
- L4 (evidence): Local Bun contract test RED: 6 pass/1 fail because `verify-linux` was absent; after T1 edits, `bun test scripts/release-workflows.test.ts ./scripts/docs` passed 14/14 and `git diff --check` passed. Independent read-only verification found no static blocker for S1/S3/S5; no remote dispatch/build or Cargo test ran. Native RDD assessment returned unassessable because untracked files need explicit declaration. No commit or push occurred.
- L5 (evidence): Cached fork default ref `samael/master` already has `workflow_dispatch` for `.github/workflows/build-artifacts-manual.yml`; candidate is 824 commits ahead of that cached ref. Do not update master just for this flow or mix the detached dirty main worktree into the candidate branch.
- L6 (evidence): Live read-only GitHub verification under Andiveli confirmed fork default `master` already contains manual `workflow_dispatch`; no default-branch bootstrap is required. Main worktree still has 382 tracked changes; candidate has unrelated `odd/tasks/sync-personal-upstream.md`, `src/server/client_commands.rs`, `src/server/headless/tests/mod.rs` changes plus `.atl/`/`.codegraph/`. Only an explicitly scoped new branch can be published without mixing or overwriting this work.
- L7 (user decision/evidence): User expressly authorized reviewable commits and non-force push only to a new `feat/navigation-release-flow` branch of `github.com/Andiveli/herdr`, without touching `master`, the detached main checkout, existing branches, or installation. GitHub returned HTTP 404 for that exact remote ref, and no local branch collision was found before branch creation.
- L8 (evidence): Created only the local candidate branch `feat/navigation-release-flow` at 1c5feb61; the tracked+untracked porcelain checksum matched before and after branch creation. The original local `samael/navigation-upstream`, remote refs, and detached main checkout remain unchanged.
