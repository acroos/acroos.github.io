---
layout: post
title:  'git worktree (farewell git stash)'
date:   2020-06-03
---

it's not every day you happen upon a git command you've never seen before.  much less a command that's been around for **three years**!  well yesterday that happened with `git worktree`.

so... what does this thing actually do you ask?  in short, it manages freshly checked out copies of a repository.  with this command you can keep around that _dirty_ working directory and create a new branch without having to stash any changes.  magic!
let's have a look at what this looks like in practice:

let's say you're working on a tasty new feature and you've got a bunch of uncommitted changes (of course you were just about to commit those with a glorious message if it wasn't for this awful disruption.)  a bug is reported that is causing a **major** outage; you need to fix this now.  previously you might do something like this:

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

this.... isn't beautiful.  with `git worktree` you can simplify this massively and avoid adding all of those untracked files before you were ready to.  you rnew flow might look something like this:

```sh
# doing awesome work...oh no! a bug!
$ git worktree add hotfix
$ cd hotfix
# amazing fix
$ cd ..
$ git worktree remove hotfix
# now... where was i?
```

this is not only fewer steps, but you also have avoided making git aware of any untracked files before you intended to.  the drawback is that running `git worktree add <NAME>` will create a directory of that name wherever you ran the command from.  my solution for this has been to add a global gitignore of all `worktrees` directories and then a nice little bash function to simplify and standardize new worktree creation.

you can add a global gitignore by first creating a file at `~/.gitignore-global` (you can name it whatever you want, actually.) and then running `git config --global core.excludesfile=${HOME}/.gitignore-global`.  inside that gitignore file you can put anything you'd like to ignore in _every_ git repo.  for me, that was just `/worktrees`

to standardize my worktree creation (so my global gitignore would always work), i created the following script (and aliases) in my zshrc:

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

now if the same scenario pops up, my workflow would look like this:

```sh
# doing awesome work...oh no! a bug!
$ gwa hotfix
$ cd worktrees/hotfix
# amazing fix
$ cd ../..
$ gwr hotfix
# now... where was i?
```
