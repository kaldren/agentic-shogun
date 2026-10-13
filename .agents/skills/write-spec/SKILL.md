---
name: write-spec
description: Write a new feature spec in specs/ from the template, on its own feature branch. Use when the user asks to write, draft or create a spec (спецификация) for a feature.
---

# Write a spec

Each spec is one feature, one file (`specs/NNN-name.md`) and one branch (`NNN-name`).
Follow the SPEC-DRIVEN WORKFLOW rules in `AGENTS.md`.

## Steps

1. **Understand the feature.** If the goal or scope is unclear, ask the user a few short questions first. Don't guess.

2. **Start from an up-to-date `main`.** The working tree must be clean; if it isn't, stop and ask the user.

   ```bash
   git checkout main && git pull --ff-only
   ```

3. **Pick the next free number.** Specs that aren't merged yet live only on their branches, so check both files on `main` and branch names (local and remote):

   ```bash
   git fetch --prune
   { ls specs; git branch -a --format='%(refname:lstrip=-1)'; } | grep -oE '^[0-9]{3}-' | sort | tail -1
   ```

   Next number = highest + 1, zero-padded to 3 digits (`001` if none). Numbers are never reused.

4. **Pick a name.** Short English kebab-case, 2–4 words (e.g. `landing-page`, `quiz-engine`).

5. **Create the feature branch** named exactly like the spec file, without `.md`:

   ```bash
   git checkout -b NNN-name
   ```

6. **Write the spec.** Copy `specs/_template.md` to `specs/NNN-name.md` and fill every section:
   - Title: `# NNN: Feature name`
   - Status: `Draft`, always.
   - Goal: 1–2 sentences, why and for whom.
   - Requirements: short, concrete bullets about _what_, not _how_.
   - Acceptance criteria: unchecked `- [ ]` items, each one testable.
   - Out of scope: what we are deliberately not building now.
   - Notes: optional. Remove the placeholder text if it's empty.

   Keep it minimal. This is an MVP, so leave out anything that isn't needed.

7. **Format and commit** on the feature branch:

   ```bash
   pnpm exec prettier --write specs/NNN-name.md
   git add specs/NNN-name.md
   git commit -m "Add spec NNN: Feature name"
   ```

   Don't push unless the user asks.

8. **Report** the file path and branch name, and ask the user to review the spec and set the status to `Approved`.

## Never

- Set the status to `Approved`. Only the owner does that.
- Write implementation code. This skill only writes the spec.
- Put more than one feature in a spec. Split it into separate specs, each with its own branch.
