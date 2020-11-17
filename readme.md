Hexo Theme React
---------------------

React theme migrated from https://github.com/pimmey/react-docs, the purchase link: https://themeforest.net/item/react-material-design-multipurpose-template/14918846

The theme is designed for Hexo, please make sure have the Hexo installed (https://hexo.io).

## Installation:

Prerequisites:

```
npm i -S hexo-renderer-pug
npm i -S hexo-renderer-sass
```

Go to the hexo site folder, and clone this repo:

```
git clone https://github.com/NoahDragon/hexo-theme-react.git themes/react
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

### Limitation

Currently only support the latest 5 projects and posts. To support blog/project list, may need to implement new layout files.

### Samples

#### Hexo Source

The hexo site source code could be found in branch demo-source https://github.com/NoahDragon/hexo-theme-react/tree/demo-source . You could clone it to local folder and replace the `themes/react` which current repo.

```
git clone -b demo-source https://github.com/NoahDragon/hexo-theme-react.git
```

#### Scaffolds

Sample scaffolds are in `sample/_scaffolds` folder. To use them, simply copy the scaffolds in to the hexo `scaffolds` folder.

#### Data

For the services, philosophy, about, and FAQs data, the sample files is in `sample/_data`. To use it, simply copy the `sample/_data` folder into the hexo `source/_data` folder.

The icons are from http://www.linea.io/, so please make sure the icon name is an existing linea icon.

The detail feild in `stars.yml` is allow HTML tags.

The general photo in about section could be set in the theme config `general-photo`.

### Themes

The original React theme provides several themes, we inherit them. The theme could be configured in the theme `_config.yml`. The followings are availiable themes ([preview](http://react.pimmey.com/)):
* combustion-purple
* combustion-yellow
* fuzzy-hue
* fuzzy-saturation
* ring-blue
* ring-green
* tunnel
* waves-deep-purple
* waves-light-blue

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
