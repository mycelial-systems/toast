# package name here
![tests](https://github.com/substrate-system/toast/actions/workflows/nodejs.yml/badge.svg)
[![types](https://img.shields.io/npm/types/@substrate-system/toast?style=flat-square)](README.md)
[![module](https://img.shields.io/badge/module-ESM%2FCJS-blue?style=flat-square)](README.md)
[![install size](https://flat.badgen.net/packagephobia/install/@bicycle-codes/keys?cache-control=no-cache)](https://packagephobia.com/result?p=@bicycle-codes/keys)
[![GZip size](https://img.badgesize.io/https%3A%2F%2Fesm.sh%2F%40substrate-system%2Ftoast%2Fes2022%2Ffile.mjs?style=flat-square&compression=gzip)](https://esm.sh/@substrate-system/toast/es2022/toast.mjs)
[![dependencies](https://img.shields.io/badge/dependencies-zero-brightgreen.svg?style=flat-square)](package.json)
[![semantic versioning](https://img.shields.io/badge/semver-2.0.0-blue?logo=semver&style=flat-square)](https://semver.org/)
[![Common Changelog](https://nichoth.github.io/badge/common-changelog.svg)](./CHANGELOG.md)
[![license](https://img.shields.io/badge/license-Big_Time-blue?style=flat-square)](LICENSE)


[Toasts](https://shoelace.style/components/alert/) as a web component.

[See a live demo](https://substrate-system.github.io/toast/)

<!-- toc -->

## Install

```sh
npm i -S @substrate-system/toast
```

## API

This exposes ESM and common JS via [package.json `exports` field](https://nodejs.org/api/packages.html#exports).

### ESM
```js
import { SubstrateToast } from '@substrate-system/toast'
```

### Common JS
```js
const Toast = require('@substrate-system/toast')
```

## CSS

### Import CSS

```js
import '@substrate-system/toast/css'
```

Or minified:
```js
import '@substrate-system/toast/css/min'
```

## Use

This calls the global function `customElements.define`. Just import, then use
the tag in your HTML.

### JS
```js
import '@substrate-system/toast'
```

### HTML
```html
<div>
    <substrate-toast></substrate-toast>
</div>
```

### pre-built
This package exposes minified JS and CSS files too. Copy them to a location that is
accessible to your web server, then link to them in HTML.

#### copy
```sh
cp ./node_modules/@substrate-system/toast/dist/index.min.js ./public/substrate-toast.min.js
cp ./node_modules/@substrate-system/toast/dist/style.min.css ./public/substrate-toast.css
```

#### HTML
```html
<head>
    <link rel="stylesheet" href="./substrate-toast.css">
</head>
<body>
    <!-- ... -->
    <script type="module" src="./substrate-toast.min.js"></script>
</body>
```
