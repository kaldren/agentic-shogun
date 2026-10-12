<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->


# RULES TO ALWAYS FOLLOW
- Always use LTS version for every library you include in the project.
- Don't use outdated or deprecated libraries.
- Always follow the official documentation and best practices for each library you use.

# SPEC-DRIVEN WORKFLOW
- Every feature has its own spec in `specs/NNN-name.md` (001, 002, ...). New specs are created by copying `specs/_template.md` and using the next free number. Numbers are never reused.
- One spec = one feature = one branch. The branch is named exactly like the spec file without `.md` (e.g. `003-quiz-engine`). The spec is written and implemented on that branch, and merged into `main` when it's `Done`.
- To write a new spec, use the `write-spec` skill.
- Status flow: Draft → Approved → Done. Only the owner sets `Approved`.
- Implement ONLY specs with status `Approved`. Never implement `Draft`.
- Never change a spec's Goal/Requirements/Acceptance criteria while implementing. If something is unclear or wrong, stop and ask.
- Build nothing listed in "Out of scope".
- When done: tick the acceptance criteria, set status to `Done`, run `pnpm lint` and `pnpm typecheck`.
