Hexo Theme React
---------------------

React theme migrated from https://github.com/pimmey/react-docs

The theme is designed for Hexo, please make sure have the Hexo installed (https://hexo.io).

## Installation:

Prerequisites:

```
npm i -S hexo-renderer-jade
npm i -S hexo-renderer-sass
```

Go to the hexo site folder, and clone this repo:

```
git clone git@bitbucket.org:l3z/hexo-theme-react.git themes/react
```

Then modify the site `_config.yml` to change the theme:

```yml
theme: react
```

Clean the database and regenerate the site:

```
hexo clean && hexo g
```