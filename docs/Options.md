# Options

Pass an object of options and functions to Malvid to adjust it's behaviour. The default configuration looks like the following:

> ⚠️ Your configuration will be merged with the defaults. You only need to set what you want to modify. Except `resolvers` and `statuses`. Those will be overwritten entirely when you specify them.

```js
{
	lang: 'en',
	title: 'Malvid',
	description: 'UI to help you build and document web components.',
	src: '',
	pattern: '**/[^_]*.{ejs,njk,hbs,twig}',
	url: (url) => url,
	resolvers: [
		{
			id: 'view',
			label: 'View',
			languages: [ 'twig' ],
			resolve: (fileName, fileExt) => [ `${ fileName }${ fileExt }` ]
		},
		{
			id: 'data',
			label: 'Data',
			languages: [ 'json', 'js' ],
			resolve: (fileName, fileExt) => [ `${ fileName }.data.json`, `${ fileName }.data.js` ]
		},
		{
			id: 'notes',
			label: 'Notes',
			languages: [ 'markdown' ],
			resolve: (fileName, fileExt) => [ `${ fileName }.md` ]
		},
		{
			id: 'config',
			label: 'Config',
			languages: [ 'json' ],
			parse: (contents) => contents=='' ? {} : JSON.parse(contents),
			resolve: (fileName, fileExt) => [ `${ fileName }.config.json` ]
		}
	],
	statuses: {
		wip: {
			label: 'WIP',
			description: 'Work in progress',
			color: '#fe913d'
		},
		pending: {
			label: 'Pending',
			description: 'Ready, but waiting for finalization',
			color: '#2d90e8'
		},
		ready: {
			label: 'Ready',
			description: 'Ready to implement',
			color: '#2bc052'
		}
	}
}
```

## Usage

### API

Pass the configuration as an object to Malvid.

Example:

```js
const malvid = require('malvid')

;(async () => {

	const opts = {
		title: 'Awesome project',
		description: 'Component library for our awesome project.'
	}

	const result = await malvid(opts)

	/* Process the result */

})()
```

### CLI

The configuration should be stored in your current working directory as `malvidfile.json` or `malvidfile.js` when using the CLI. Configuration files formatted as JavaScript should be in the style of a module that exports an object.

Examples:

```json
{
  "title": "Awesome project",
  "description": "Component library for our awesome project."
}
```

```js
module.exports = {
	title: 'Awesome project',
	description: 'Component library for our awesome project.'
}
```

## Properties

### Lang

Type: `String` Optional: `true`

Declare the language of the UI page.

Example:

```json
{
  "lang": "de"
}
```

### Title

Type: `String` Optional: `true`

Title of the UI page.

Example:

```json
{
  "title": "Awesome project"
}
```

### Description

Type: `String` Optional: `true`

UI page description.

Example:

```json
{
  "description": "Component library for our awesome project."
}
```

### Src

Type: `String` Optional: `true`

Path to the folder Malvid should scan.

Example:

```json
{
  "src": "src/"
}
```

### Pattern

Type: `String` Optional: `true`

The component files Malvid should look for using the same [patterns the shell uses](https://github.com/isaacs/node-glob).

Example:

```json
{
  "pattern": "**/*.njk"
}
```

Pattern examples:

| Pattern | Description |
|:-----------|:------------|
| `*.njk` | Matches all Nunjucks files in the root of your project |
| `[^_]*.njk` | Matches all Nunjucks files in the root of your project not starting with an underscore |
| `**/*.twig` | Matches all Twig files |
| `**/*.{twig,ejs}` | Matches all Twig and EJS files |
| `components/*/*.ejs` | Matches all EJS files located in a subdirectory of `components/` |
| `components/[^_]*/*.ejs` | Matches all EJS files located in a subdirectory of `components/` when the subdirectory does not start with an underscore |
| `components/**/*.ejs` | Matches all EJS files located in `components/` or in any subdirectory of `components/` |

### URL

Type: `Function` Optional: `true`

Function that accepts and returns a URL. Allows you to modify the preview URL of components.

Example:

```js
{
	url: (url) => 'http://localhost:3000' + url
}
```

### Resolvers

Type: `Array` Optional: `true`

Specify the files that belong to components. Each item represents a tab in the UI.

Resolvers like the `view` and `config` should always be part of the array. Otherwise you can't see the view or adjust the [behaviour of a component](Components.md#configuration). The nice thing however is that you can specify how Malvid should parse those files. Use a custom function in the `parse` property and Malvid works with every format you can think of. Want to use YML instead of JS or JSON for the configuration? No problem!

Example:

```js
{
	id: 'style',
	label: 'Style',
	languages: [ 'sass', 'scss', 'css' ],
	resolve: (fileName, fileExt) => [ `${ fileName }.sass`, `${ fileName }.scss`, `${ fileName }.css` ]
}
```

Malvid scans your folders and finds a component called `button.njk`. It will run though all resolvers to find files that could belong to this button component. It executes the `resolve` function with the parameter `button` and `.njk`. The `resolve` function returns `[ 'button.sass', 'button.scss', 'button.css' ]` and Malvid looks for files called `button.sass`, `button.scss` and `button.css` in the same folder as the component. Let's say the SASS file exists and Malvid continues to process the resolver. It executes the `parse` function (when defined) to parse the contents of the file. The returned value will be shown in the [inspector of the UI](Interface.md#inspector) in a tab with the name `Style`. Malvid does this for all components and resolvers.

#### Id

Type: `String` Optional: `false`

Unique identifier.

Can be everything except `config`. `config` is special and should only be used for the configuration resolver.

#### Label

Type: `String` Optional: `false`

Name that describes the content of the file.

The output of the resolver will be shown as a tab in the [inspector of the UI](Interface.md#inspector). This label will be used for the name of the tab.

#### Languages

Type: `Array` Optional: `false`

Syntax highlighting languages.

Supports any language supported by [highlight.js](https://highlightjs.org). Will be used to highlight the output of the resolver in the [inspector of the UI](Interface.md#inspector). Multiple values are helpful when a resolver accepts multiple formats.

#### Parse

Type: `Function` Optional: `true`

Defines how Malvid should parse the contents of the file.

A resolver without a `parse` property will show the contents without modifying it.

#### Resolve

Type: `Function` Optional: `false`

Function that returns an array of filenames that Malvid should look for.

### Statuses

Type: `Object` Optional: `true`

Available statuses.

Components can have [statuses associated with them](Interface.md#statuses). Those will be shown in the navigation and preview when specified in the [configuration of a component](Components.md#status). A status must be defined before you can use it and this is the right option to do so.

Example:

```json
"statuses": {
  "wip": {
    "label": "WIP",
    "description": "Work in progress",
    "color": "#fe913d"
  }
}
```

#### Label

Type: `String` Optional: `false`

Label of the status.

Should be short as the label will be displayed on the top right in the [preview of the UI](Interface.md#preview).

#### Description

Type: `String` Optional: `false`

Description of the status.

Will be displayed as a tooltip when you hover the status in the [navigation](Interface.md#navigation) or the status label on the top right in the [preview of the UI](Interface.md#preview).

#### Color

Type: `String` Optional: `false`

Hex color of the status.

Will be used for the status indicator in the [navigation](Interface.md#navigation) and for the status label background on the top right in the [preview of the UI](Interface.md#preview).