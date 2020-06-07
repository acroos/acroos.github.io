---
layout: post
title:  'git worktree (farewell git stash)'
date:   2020-06-03
---

It's not every day you happen upon a git command you've never seen before.  Much less a command that's been around for **three years**!  Well, yesterday that happened with `git worktree`.

So... what does this thing actually do you ask?  In short, it manages freshly checked out copies of a repository.  With this command you can keep around that _dirty_ working directory and create a new branch without having to stash any changes.  **Magic!**

### the old way

Let's say you're working on a tasty new feature and you've got a bunch of uncommitted changes (of course you were just about to commit those with a glorious message if it wasn't for this awful disruption.)  A bug is reported that is causing a **major** outage; you need to fix this now.  
You might do something like this:

```sh
# doing awesome work... oh no! a bug!
$ git stash
# damn it, all of these untracked files!
$ git stash pop
$ git add .
$ git stash
$ git checkout -b hotfix
# amazing fix
$ git checkout -
$ git stash pop
# now... where was i?
```

this.... isn't beautiful.  We can definitely do better (with, as you may have guessed, `git worktree`).  So what will your workflow look like next with worktrees?

### an improvement!

```sh
# doing awesome work...oh no! a bug!
$ git worktree add hotfix
$ cd hotfix
# amazing fix
$ cd ..
$ git worktree remove hotfix
# now... where was i?
```

This is not only fewer steps, but you've also avoided making git aware of any untracked files before you intended to.  This doesn't come completely without consequence, though.  The primary consequences that I see are (1) a new directory in your main branch that you'll need to ignore and (2) risk of your directory growing _massively_ if you don't cleanup.

### we can still do better

There are plenty of ways you could handle the new directory without just pretending like its not there and being careful not to add it.  My solution for this has been to add a global gitignore of all `worktrees` directories and then a nice little shell function to simplify and standardize new worktree creation.  I have yet to encounter the issue of the ever-growing number of worktrees, so I don't have a trusted solution for that yet.

To globally gitignore worktress directories, you can add a global gitignore.   First, create a file at `~/.gitignore-global` (you can name it whatever you want, actually.) Next, run `git config --global core.excludesfile=${HOME}/.gitignore-global`.  Inside that gitignore file you can put anything you'd like to ignore in _every_ git repo.  For me, for this solution, that was just `/worktrees`

To standardize worktree creation (so the global gitignore would always work), I created the following script (and aliases) in my .zshrc:

```sh
git_worktree_add() {
  local root_dir=`git rev-parse --show-toplevel`
  local worktree_dir="worktrees/${1}"
  cd $root_dir
  git worktree add "${worktree_dir}"
}

alias gwa='git_worktree_add'
alias gwr='git worktree remove'
```

### the beautiful game

Now if the same scenario pops up, your workflow will look like this:

```sh
# doing awesome work...oh no! a bug!
$ gwa hotfix
$ cd worktrees/hotfix
# amazing fix
$ cd ../..
$ gwr hotfix
# now... where was i?
```
