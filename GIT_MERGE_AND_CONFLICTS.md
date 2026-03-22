# Git: merge `jk` into `main` and fix conflicts

This repo layout has **two separate Git projects**: `backend/` and `frontend/`. Run the commands in the folder you care about.

---

## 1. Normal merge (`jk` → `main`)

```bash
cd backend    # or: cd frontend

git fetch origin
git checkout main
git pull origin main
git merge jk -m "Merge branch jk into main"
git push origin main
```

- If Git prints **“Already up to date”**, `main` already contains everything from `jk`; nothing to merge.
- If the merge **succeeds with no conflicts**, commit is created automatically (or you finish with `git push` as above).

---

## 2. When Git reports merge conflicts

After `git merge jk`, you may see:

```text
Automatic merge failed; fix conflicts and then commit the result.
```

### Step A — See what’s wrong

```bash
git status
```

Files under **“both modified”** or **“Unmerged paths”** need you to choose the final content.

### Step B — Open each conflicted file

Conflict markers look like this:

```text
your current branch (usually main) version
```

- **Keep one side**: delete the markers and the block you don’t want.
- **Combine both**: edit so the file is correct, then remove **all** `<<<<<<<`, `=======`, `>>>>>>>` lines.
- **Use one branch for the whole file** (careful — you lose the other side’s edits in that file):
  - Keep **main**’s version: `git checkout --ours path/to/file`
  - Keep **jk**’s version: `git checkout --theirs path/to/file`  
  Then remove markers if any remain, or re-open the file and verify.

### Step C — Mark files as resolved

```bash
git add path/to/file
# repeat for every conflicted file
```

### Step D — Finish the merge

```bash
git status    # should show all conflicts resolved, ready to commit
git commit    # if Git didn’t auto-open a message, use: git commit -m "Merge branch jk into main"
git push origin main
```

To **cancel** the merge and go back to before you ran `git merge`:

```bash
git merge --abort
```

---

## 3. Common errors (not conflicts)

### `! [rejected] main -> main (non-fast-forward)`

Your local `main` and `origin/main` have **diverged** (different commits on each).

**Option A — Integrate remote first (safest for teams)**

```bash
git pull origin main
# if conflicts appear, resolve like section 2, then:
git push origin main
```

**Option B — Remote is wrong and you want local `main` to win** (overwrites remote `main`; use only if you intend that):

```bash
git push origin main --force-with-lease
```

`--force-with-lease` refuses to push if someone else updated `main` since your last fetch.

### `fatal: refusing to merge unrelated histories`

Two branches were created from **different initial commits** (e.g. duplicate `git init`). Merging needs an explicit allow:

```bash
git pull origin main --allow-unrelated-histories
```

Expect **many conflicts**; resolve as in section 2. If the remote history is not needed, discuss with the team before replacing `main` with a force push instead.

### `Merge conflict in package-lock.json` (or `yarn.lock`)

- Often easiest: pick one side’s lockfile, then regenerate:
  - **npm**: delete `node_modules`, run `npm install`, then `git add package-lock.json`
- Or resolve manually only if you know exactly which dependency versions you need.

---

## 4. Workflow summary

| Step | Action |
|------|--------|
| 1 | Commit or stash work on `jk` |
| 2 | `git checkout main` && `git pull origin main` |
| 3 | `git merge jk` |
| 4 | If conflicts → edit files → `git add` → `git commit` |
| 5 | `git push origin main` |

---

## 5. Optional: merge tools

- **VS Code / Cursor**: open conflicted file → use **“Accept Current / Incoming / Both”** in the UI, then save and `git add`.
- **CLI mergetool**: `git mergetool` (after configuring a mergetool in Git).

---

*Paths: use `d:\FinX\backend` or `d:\FinX\frontend` on Windows; same commands in Git Bash or PowerShell.*
