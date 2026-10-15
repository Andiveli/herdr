# Sync personal navigation onto upstream

Base: `upstream/master` at `4dc23bb1`. Candidate branch: `samael/navigation-upstream`. Original `samael/personal` has an in-progress merge; backup `samael/backup/personal-before-sync-20261008-152418` at `d294d3a9`. Neither will be modified by this task.

Scope: Preserve only fork-specific navigation of panes, tabs and workspaces. Keep upstream equivalents instead of duplicating them. Exclude fork graphics, Pi integration, and unrelated UI customizations.

## Tasks

- [x] Identify fork-specific navigation against merge-base `7d56b4c5` and upstream equivalents. Evidence: upstream already includes configurable directional pane/workspace navigation and tab mouse scrolling; fork-specific horizontal pane-to-tab edge motion is absent upstream. Commit: pending alignment.
- [x] Implement missing motions in the new client-shell architecture, with tests. Evidence: opt-in pane-to-tab motion across bindings, async request correlation, one-tab parity, and stale-response tests. Test-first RED observed (missing binding field), initial GREEN followed by final `just test-one pane_or_tab_motion` (3 passed). Upstream already covers other personal navigation. User accepted the larger review unit. Commit: see work-unit identity below.
- [x] Verify the bounded candidate. Evidence: final `cargo fmt --check`, `git diff --check`, `just docs-contract-test` (7 passed) and focused motion tests (3 passed). User explicitly accepted narrower validation: full `just check` and two maintenance suites were not run because disk was limited. Native review consent expired before lineage creation; no approved receipt. Commit: see work-unit identity below.
- [ ] Commit approved work unit and decide later whether to replace/abort original branch or push. Evidence: user aligned on `feat(keys): restore pane-to-tab motion on upstream` and explicitly accepted pending checks; no remote publication authorized.

Work-unit identity: pending commit.
