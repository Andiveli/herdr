# Build a personal fork binary on GitHub

Use the fork's manual artifact workflow to run Linux checks and compile on GitHub, then install only a verified binary. No local Cargo build is needed. This workflow is for the personal fork; it does not open a pull request, create an issue, or merge changes automatically.

## Quick path

1. Preserve uncommitted work. Integrate the desired upstream release on a clean branch, resolve any conflicts, and publish only the reviewed branch to `Andiveli/herdr` with separate authorization.
2. Confirm `.github/workflows/build-artifacts-manual.yml` exists on the fork's default branch. Once the selected branch is published, dispatch the workflow against **that branch**:

   ```sh
   gh workflow run build-artifacts-manual.yml --repo Andiveli/herdr --ref YOUR_PUBLISHED_BRANCH -f build_group=linux -f libghostty_optimize=ReleaseSafe -f libghostty_simd=false
   ```

3. Find the run for that branch and wait for completion. Only a successful `verify-linux` job followed by a successful `build-linux` job produces an installable candidate. A failed or timed-out check is a stop, not a reason to install an artifact from another run.
4. Download `herdr-linux-x86_64-ReleaseSafe-simd-false` from the **same run**. Check `BUILD_INFO.txt` against the run's source commit and `target=x86_64-unknown-linux-musl`; compare its `sha256=` value with `sha256sum herdr-linux-x86_64`, and confirm the binary's architecture with `file`.
5. Back up the installed binary, install the checked binary atomically, and check its version and behavior. Do not restart a running server implicitly.

## What the workflow checks

`verify-linux` runs `just ci` (formatting, lint, nextest, maintenance, architecture, and integration-asset checks) and `just docs-contract-test` on a GitHub Linux runner. Every selected platform build depends on it. The workflow keeps the existing build-group choices and records the commit, target, build options, and SHA-256 with each artifact.

GitHub requires a manually dispatched workflow to exist on the fork's default branch before it can run on another branch with `--ref`. The fork's cached default branch already has this manual workflow; verify its live state before dispatch, and do not update the default branch just to run the selected feature branch. The previously observed SIGHUP shutdown-log test failure means a green run is **not** guaranteed; do not bypass the gate or claim it passed until GitHub records it.
