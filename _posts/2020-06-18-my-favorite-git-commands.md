---
layout: post
title:  'my favorite git commands'
date:   2020-06-18
---

Well, let's keep it simple, eh?  Without further ado, here's a quick list of my favorite git commands:

---

## `git add -p`

Where do I even begin with this one?  If you haven't yet met the `-p` flag (short for patch) in git... get to know it.  This command has saved me from accidentally committing whitespace errors, TODOs, and so much more on which a reviewer would politely comment "is this supposed to be here?"  On top of being able to review your changes before adding them, you get a chance to slow down and do a mini review of your own code before committing it.
After hitting return, you'll see a chunk of code ready to be added and this input line `(1/1) Stage this hunk [y,n,q,a,d,e,?]?`.  Just press `?` and git will tell you how to proceed.

---

## `git branch -m`

So you've started a branch and committed some awesome work.  Great!  But... you accidentally named the branch after an entirely different feature.  This isn't going to make or break the work by any means, but it's certainly not ideal.  For some software that may rely on your branch, strict branch naming conventions are required, so you may actually _need_ to change it.  Well, thankfully `git branch -m` does exactly that!
If you're currently on the branch that needs renaming, just run `git branch -m <NEW NAME>`.  If you're on another branch, you can run `git branch -m <OLD NAME> <NEW NAME>`.  Note, a `-M` version exists that just adds a `--force` (sometimes you just gotta force it).

---

## `git checkout -b`

Simple, but effective.  Create a new branch and switch to it.  I've aliased this one in my shell to `gcob` and I use it all the time.

---

## `git checkout -p`

The `-p` flag is back!  I told you this flag is the best.  Again, this flag is short for patch, and for this command it has two use cases.  First, if you want to throw out some changes to a file, but not all of them, `git checkout -p -- <FILE PATH>`.  This will bring up the same interactive line as with `git add -p`, except this time you're selecting which chunks to throw out.
Next, probably less often used, is the ability to grab code in chunks from another branch (or commit) and place it in your current branch.  Say you're working on a feature branch and you want to use some code you wrote on another branch.  You _could_ cherry-pick the commit... if you wrote nice tiny commit that has only changes you want.  Alternatively you can run `git checkout -p <OTHER BRANCH> -- <FILE>` and select precisely the changes you want.

---

## `git rebase -i`

And finally we come to the interactive rebase.  I love this command not because of how frequently I use it, but because of how powerful it can be when used in just the right scenario.  Before using this command, you should know that you can _really_ mess things up if you're not careful.  With this command, you can basically rewrite the entire git history of a repository exactly how you'd like it.
This means you can move commits around, squash commits together, delete commits entirely, cherry-pick commits from other branches, and probably more that I can't think of.  There have been a few times when I've found this tremendously useful.

The first was actually when I discovered the command.  I had a few beautiful, atomic commits in a row before submitting my PR for review.  Apparently I was more careful with the commits than the code because I had to make 3 or 4 more commits to fix typos, test cases, etc.  With an interactive rebase, I was able to squash those "fixed typo" commits into the commit where the typo was created.  After fixing everything and rebasing, I was back to my original beautiful commits.

The second time was when I needed to undo a few commits of work that was no longer necessary (requirements change...)  Of course I _could_ revert those commits, but then my history looks like "did A", "did B", "did C", "undid B", "undid A".  That's not great.  And our git history didn't need to tell the story of a small requirement change mid-week.
All I had to do was run `git rebase -i HEAD~3` and then drop the first two commits (it will open your `$EDITOR` and you change the line prefix to `drop`.  It should be noted that this really works best if you keep your commits small and (mostly) atomic.

---

## `git bisect`

Admittedly, I _almost never_ need this command.  But I find it to be such a delightful tool that I had to share.  The idea behind the commit, at least as far as I've seen it used, is to look back into git history to find specifically the commit that introduced a bug.  You begin the process with `git bisect start`.  Next you need to tell it one "bad" commit (where you know the bug exists) and one "good" commit (where you know the bug didn't exist).
It will then use binary search to check out commits in between those.  After it checks out the commit, you can test things out however you need to validate whether the bug exists and then run `git bisect good` or `git bisect bad` depending on whether or not the bug exists.
