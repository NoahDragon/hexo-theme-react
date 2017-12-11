Source code for company website
-------------

**No need to manual deploy the change, simply commit/push the change, CI will do the rest**

There are two ways to modify the company site:
1. Modify file directly in this repo;
2. Pull this repo to local.

## Change file via Bitbucket editor

This is straight forward, simply edit the files through Bitbucket interface. However, you may need to check if any error occurs during Piplines process.

## Change on local

Here is the steps:
1. Clone the repo with theme submodule `git clone --recursive git@bitbucket.org:l3z/site.git`;
2. Modify the files;
3. Push.

## Development Guide

To develop new feature or test on local machine, here is the steps:
1. Install Hexo (https://hexo.io);
2. Clone the repo with theme submodule `git clone --recursive git@bitbucket.org:l3z/site.git`;
3. Goto the cloned directory, run `npm install`;
4. If the theme also need change, goto the `theme/react` folder, run `git checkout master` (Commit/Push submodule first then commit the main repo will keep the submodule to the latest commit).

To create a new blog: `hexo new post "new blog name"`

To create a new project: `hexo new project "new project name"`

Create new scaffold, add new file with the scaffold name (e.g. `myscaffold.md`) to the `scaffolds` folder. Then run `hexo new myscaffold "post name"` will create a post with the new scaffold layout. However, to respect the new scaffold you may also need to change files in theme.


