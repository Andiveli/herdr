# Personal fork navigation and tab parity
Candidate: `feat/navigation-release-flow` in the linked upstream-based worktree.
Status: implementation pending; the verified artifact from run 37928878617 contains neither the navigation fix nor tab parity; never install it as this candidate.

## Specs
- S1: «Quiero 2, 3, y 4 también.»
- S2: «Alt+h/l y tabs antes de instalar»
- S3: «Lo que me importa es el binario, aún no lo tenemos instlada?»

## Tasks
- T1 [S2] [in progress] Preserve and validate the existing `Alt+h/l` allowlist fix and its public-interface regression tests without including unrelated edits; route: inline, independent verification if native risk is high; commit: pending checks.
- T2 [S1, S2] [pending] Port the old fork's auto tab label based on focused pane CWD, falling back to root pane CWD then tab index, while preserving explicit labels; add focused behavioral coverage and documentation; route: inline unless independent writer units become viable; commit: pending checks.
- T3 [S1, S2] [pending] Port active/inactive tab foreground colors without requiring a background fill; cover defaults, custom config and existing theme behavior; route: inline; commit: pending checks.
- T4 [S1, S2] [pending] Add a configuration option to hide the `+` new-tab control without disabling keyboard tab creation; cover render, mouse hit area, config and docs; route: inline; commit: pending checks.
- T5 [S2, S3] [pending] Require a separately authorized GitHub Linux test→build dispatch for the exact new candidate and verify same-run commit, architecture and SHA-256; route: parent, no local Cargo; commit: not applicable to remote checks.
- T6 [S2, S3] [blocked: explicit installation authorization and verified new artifact required] Back up the installed binary and install only the verified new candidate without implicitly changing the running server or dirty checkout; route: parent; commit: not applicable.

## Log
- L1 (user, verbatim): «Quiero 2, 3, y 4 también.»
- L2 (user choice, exact displayed label): «Alt+h/l y tabs antes de instalar» (selected instead of installing the already verified but incomplete binary).
- L3 (user, verbatim): «Lo que me importa es el binario, aún no lo tenemos instlada?»
- L4 (evidence): The old committed fork `d294d3a9` implements auto tab names in `src/workspace/tab.rs:208`: custom label > focused pane CWD > root pane CWD > one-based tab index. `derive_label_from_cwd` in `src/workspace/git/discovery.rs:21` uses repository-aware workspace labels, otherwise `~` for HOME, final component or displayed path. The dirty detached checkout is not a safe source for restoration; read committed blobs only.
- L5 (evidence): Old `src/ui/tabs.rs` draws active/inactive foreground colors `tab_active_fg`/`tab_inactive_fg`, with no tab background fill; its new-tab hit area/render depends on `show_new_tab_button`. Port semantics to the candidate architecture rather than copying incompatible old UI code.
- L6 (evidence): The existing candidate has uncommitted changes only in `src/server/client_commands.rs` and `src/server/headless/tests/mod.rs` for `pane.neighbor`/`pane.layout` and prior 60/60 focused client-shell tests. Published SHA `832afee2` and verified artifact from run `37928878617` do not include these changes or tab features. No local Cargo, new run, source commit/push or installation has occurred in this feature.
- L7 (user decision/evidence): User authorized reviewable commits and non-force push only to `feat/navigation-release-flow` for navigation and tabs, explicitly excluding a new workflow dispatch and installation. Created this tracking document in isolated conventional commit `d367954a29a2ce6a6fb54e8010c490fba5baef68` after verifying an empty index and exact starting HEAD. Existing unrelated edits stayed unstaged; no push yet.
- L8 (T1 evidence in progress): The original unstaged candidate fix was 85 insertions across exactly `src/server/client_commands.rs` and `src/server/headless/tests/mod.rs`. Independent read-only verification found the two new methods query-only and guards intact, but noted missing public coverage of direction, neighbor result, cross-tab layout and unchanged rejection. Added those assertions and rejection to the existing public server test; `git diff --check` passes. Earlier focused client-shell tests passed 60/60; earlier serial suite was 3965/3966 with an unexplained SIGHUP failure. No fresh Cargo is permitted, so new tests and full CI are unproven. Local rustfmt check finds formatting differences elsewhere in the existing large test module; our added block was aligned without changing unrelated code. RDD mode is globally on; no source work-unit commit, push, new GitHub run, artifact or installation yet.
