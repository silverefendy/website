# GIT_GUIDE.md

# Git Guide / Panduan Git

## git clone
Purpose: download a repository.
Syntax:
```bash
git clone <url>
```
Example:
```bash
git clone https://github.com/company/marketplace.git
```
Common errors: authentication failed, repository not found.  
Troubleshooting: check URL, access rights, SSH key/token.

## git pull
Purpose: download and merge latest changes.
Syntax:
```bash
git pull origin main
```
Common errors: local changes conflict.  
Troubleshooting: commit/stash changes before pulling.

## git fetch
Purpose: download remote metadata without merging.
```bash
git fetch origin
```
Use when you want to inspect changes before merging.

## git add
Purpose: stage files for commit.
```bash
git add README.md
git add .
```
Common errors: accidentally staging secrets.  
Troubleshooting: use `.gitignore`; review `git status`.

## git commit
Purpose: save staged changes locally.
```bash
git commit -m "Update documentation"
```
Common errors: no staged changes.  
Troubleshooting: run `git add` first.

## git push
Purpose: upload commits to remote.
```bash
git push origin main
```
Common errors: rejected non-fast-forward.  
Troubleshooting: pull/rebase before push.

## git branch
Purpose: list/create branches.
```bash
git branch
git branch feature/docs
```

## git checkout
Purpose: switch branches or restore files.
```bash
git checkout feature/docs
git checkout -- README.md
```
Modern alternative:
```bash
git switch feature/docs
git restore README.md
```

## git merge
Purpose: combine another branch into current branch.
```bash
git merge feature/docs
```
Common errors: merge conflicts.  
Troubleshooting: edit conflict markers, `git add`, then commit.

## git rebase
Purpose: replay commits on top of another branch.
```bash
git rebase main
```
Common errors: conflicts during rebase.  
Troubleshooting: resolve, `git add`, `git rebase --continue`; abort with `git rebase --abort`.

## git stash
Purpose: temporarily save uncommitted work.
```bash
git stash
git stash pop
```
Common errors: conflicts on pop.  
Troubleshooting: resolve conflicts and commit.

## git reset
Purpose: move branch pointer or unstage files.
```bash
git reset HEAD file.txt
git reset --soft HEAD~1
git reset --hard HEAD~1
```
Warning: `--hard` deletes local changes.

## git revert
Purpose: create a new commit that undoes a previous commit.
```bash
git revert <commit-sha>
```
Recommended for shared branches because it preserves history.

## Indonesian Tips

- Selalu jalankan `git status` sebelum commit/push.
- Jangan commit file `.env`.
- Gunakan branch untuk fitur baru.
- Gunakan `git revert`, bukan `reset --hard`, untuk membatalkan commit yang sudah dipush.
