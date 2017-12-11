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

## Usage

### Blog

To publish posts into the blog section on the home page, the layout in front matters should set to `post`.

```
layout: post
```

### Blog Author

If `author` is not set in the front matters, then `author` in config file will be used.

### Project

To publish a proejct into the projects section on the home page, the layout in front matters should set to `project`.

```
layout: project
```

### Featured Image

Set the image path in the front matters as:

```
featured: /img/featured_image.jpg
```

Then put the `featured_image.jpg` under the `source/img` folder.

### Background Image

Set the background image for modal popup. Set the image path in the front matters as:

```
background: /img/background_image.jpg
```

Then put the `background_image.jpg` under the `source/img` folder.
