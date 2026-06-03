# Git Guide

## clone
Downloads a repository.
```bash
git clone <url>
```

## pull
Fetches and merges remote changes.
```bash
git pull origin main
```

## fetch
Downloads remote references without merging.
```bash
git fetch origin
```

## add
Stages changes.
```bash
git add README.md
git add .
```

## commit
Creates a local commit.
```bash
git commit -m "Update documentation"
```

## push
Uploads commits.
```bash
git push origin main
```

## branch and checkout
```bash
git branch feature/docs
git checkout feature/docs
```

## merge and rebase
```bash
git merge feature/docs
git rebase main
```

## stash, reset, and revert
```bash
git stash
git reset --soft HEAD~1
git revert <commit-sha>
```

Avoid committing `.env` files or production secrets.
