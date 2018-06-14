# Rapid Release

Rapid Release is a tool to help automate the required steps to create a new release of your app.

## Usage

```
npx rapid-release VERSION
```

VERSION can be any of major, minor, patch, premajor, preminor, prepatch, prerelease, 1.2.3 (uses [npm version](https://docs.npmjs.com/cli/version))

It makes a few assumptions about the project, so be sure those things are true with your project.

The main goal is to marge the `develop` branch into `master`, push everything and add the required tags. The main assumption is that you follow gitflow and you have a `develop` (or any branch name that contains the string `dev`) that you want to merge into `master` and release.

It also assumes that you want `master` and `develop` branch to have the exact same commits after the release is done, which is a good practise.

## Actions

Following are the actions that Rapid Release executes, in the order those are executed.

- Check if the current branch has the string `dev` in it's name
- `npm test` run tests or skip them using flag `-s`
- `git pull` make sure we have all changes
- `npm version VERSION` VERSION is the version you specified
- `git push` push the new commit that npm created
- `git push --follow-tags` push the tag that npm created
- `git checkout master` go to `master` branch
- `git pull` make sure we have latest code
- `git merge DEV_BRANCH` merge the branch we started in, to `master`
- `git push` push the new release code
- `npm publish` only if you used the `-p` flag
- `git checkout DEV_BRANCH` go back to the branch we started at

## Available flags

`-s` or `--skip-tests` to skip running the tests (`npm test`)  
`-p` or `--npm-publish` to publish on npm (`npm publish`)
