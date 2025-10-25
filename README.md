# toast
[![tests](https://img.shields.io/github/actions/workflow/status/substrate-system/toast/nodejs.yml?style=flat-square)](https://github.com/substrate-system/toast/actions/workflows/nodejs.yml)
[![types](https://img.shields.io/npm/types/@substrate-system/toast?style=flat-square)](README.md)
[![module](https://img.shields.io/badge/module-ESM%2FCJS-blue?style=flat-square)](README.md)
[![install size](https://flat.badgen.net/packagephobia/install/@bicycle-codes/keys?cache-control=no-cache)](https://packagephobia.com/result?p=@bicycle-codes/keys)
[![GZip size](https://flat.badgen.net/bundlephobia/minzip/@substrate-system/toast)](https://bundlephobia.com/package/@substrate-system/toast)
[![semantic versioning](https://img.shields.io/badge/semver-2.0.0-blue?logo=semver&style=flat-square)](https://semver.org/)
[![Common Changelog](https://nichoth.github.io/badge/common-changelog.svg)](./CHANGELOG.md)
[![license](https://img.shields.io/badge/license-Big_Time-blue?style=flat-square)](LICENSE)


[Toasts](https://shoelace.style/components/alert/) as a web component.

[See a live demo](https://substrate-system.github.io/toast/)

<!-- toc -->

- [Install](#install)
- [API](#api)
  * [ESM](#esm)
  * [Common JS](#common-js)
- [CSS](#css)
  * [Import CSS](#import-css)
- [Use](#use)
  * [JS](#js)
  * [HTML](#html)
  * [pre-built](#pre-built)

<!-- tocstop -->

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

## Attributes

### `open`
**Type:** Boolean
**Default:** `false`

Automatically displays the toast when the component is connected to the DOM.

```html
<substrate-toast open>
    Message will show immediately
</substrate-toast>
```

### `timeout`
**Type:** Number (milliseconds)
**Default:** `3000`

Controls how long the toast is displayed before automatically hiding.
Set to `0` for infinite display (toast will not auto-hide).

```html
<substrate-toast timeout="5000">Shows for 5 seconds</substrate-toast>

<substrate-toast timeout="0" closable>
    Shows until manually closed
</substrate-toast>
```

### `closable`
**Type:** Boolean
**Default:** `false`

Shows a close button that allows users to manually dismiss the toast.

```html
<substrate-toast closable>
    Message with close button
</substrate-toast>
```

### Variants

**Type:** Boolean (mutually exclusive)
**Default:** `neutral`
**Valid Values:** `primary`, `success`, `neutral`, `warning`, `danger`

Determines the visual style and icon of the toast. Only one variant should
be present.

| Variant | Icon | Use Case |
|---------|------|----------|
| `primary` | Info circle | General information/announcements |
| `success` | Checkmark circle | Successful operations/confirmations |
| `neutral` | Info circle | Neutral/default messages |
| `warning` | Triangle alert | Warnings/cautions |
| `danger` | X circle | Errors/failures |

```html
<substrate-toast success>Operation successful!</substrate-toast>
<substrate-toast warning>Please review your settings.</substrate-toast>
<substrate-toast danger>An error occurred.</substrate-toast>
<substrate-toast primary>Information message.</substrate-toast>
```

## Events

[Use the static method `.event`](https://github.com/substrate-system/web-component?tab=readme-ov-file#listen-for-events)
to get namespaced event names for this component.


### `substrate-toast:show`
**Event Detail:** `{ variant: ToastVariant }`

Fired when the toast becomes visible (animation starts).

```js
import { SubstrateToast } from '@substrate-system/toast'
const toast = document.querySelector('substrate-toast')

toast.addEventListener(SubstrateToast.event('show'), (ev) => {
  console.log('Toast showing with variant:', ev.detail.variant)
})
```

### `substrate-toast:hide`
**Event Detail:** `{ variant: ToastVariant }`

Fired when the toast is being hidden (either from timeout or manual close).

```js
import { SubstrateToast } from '@substrate-system/toast'

const toast = document.querySelector('substrate-toast')
toast.addEventListener(SubstrateToast.event('hide'), (ev) => {
  console.log('Toast hidden with variant:', ev.detail.variant)
})
```

## Methods

### `toast()`
Display the toast by adding it to the queue and triggering the show animation.
Toasts display sequentially - only one toast is visible at a time.

```js
const toast = document.querySelector('substrate-toast')
toast.toast()
```

### `hide()`
Hide the currently visible toast and process the next one in the queue.

```js
const toast = document.querySelector('substrate-toast')
toast.hide()
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
The default timeout is 3 seconds. Set the time in milliseconds by passing
in the `timeout` attribute.

```js
import '@substrate-system/toast'

const el = document.querySelector('substrate-toast')

// programmatically show the toast
el?.toast()
```

### HTML
```html
<div>
    <substrate-toast timeout="4000"></substrate-toast>
</div>
```

### pre-built

This package exposes minified JS and CSS files too. Copy them to a location
that is accessible to your web server, then link to them in HTML.

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
