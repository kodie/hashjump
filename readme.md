# hashjump

[![npm package version](https://img.shields.io/npm/v/hashjump.svg?style=flat-square)](https://www.npmjs.com/package/hashjump)
[![Travis build status](https://img.shields.io/travis/com/kodie/hashjump.svg?style=flat-square)](https://travis-ci.com/kodie/hashjump)
[![npm package downloads](https://img.shields.io/npm/dt/hashjump.svg?style=flat-square)](https://www.npmjs.com/package/hashjump)
[![code style](https://img.shields.io/badge/code_style-standard-yellow.svg?style=flat-square)](https://github.com/standard/standard)
[![license](https://img.shields.io/github/license/kodie/hashjump.svg?style=flat-square)](license.md)

A tiny, dependency-free JavaScript module for handling anchor links and scrolling elements into view.


## Features

* Tiny (Around ~8kb minified)
* Zero dependencies
* Supports horizontal as well as vertical scrolling
* Supports easing functions for scrolling animations (even custom ones so things like [d3-ease] are supported!)
* Supports custom functions for when anchor links are clicked or the page was visited with an anchor link
* Scroll the window to bring your element to the center of the viewport (or any other position in the viewport)


## Demo

Visit https://hashjump.js.org


## Installation


### Manual Download

[Download the latest version of hashjump](https://github.com/kodie/hashjump/archive/refs/heads/main.zip) and then place the following HTML in your page's head element:

```html
<script type="text/javascript" src="dist/hashjump.min.js"></script>
```


### CDN (Courtesy of [jsDelivr](https://jsdelivr.com))

Place the following HTML in your page's head element (check to make sure the version in the URLs are the version you want):

```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/kodie/hashjump@0.0.1/dist/hashjump.min.js"></script>
```


### [NPM](https://npmjs.com)

```
npm install hashjump --save
```

```js
// ES6
import hashjump from 'hashjump'
// CommonJS
const hashjump = require('hashjump')
```


### [GPM](https://github.com/itsahappymedium/gpm)

```
gpm install kodie/hashjump --save
```


### [Bower](https://bower.io)

```
bower install kodie/hashjump --save
```


## Usage


### `hashjump` Function

`hashjump([targetHashes], [opts])`

`hashjump([opts])`

Initializes hashjump for the defined `targetHashes` anchor links (or all anchor links if omitted). Sets page load and link click event handlers and saves `opts`.

*Note: If running this function multiple times, you should always call any instances with `targetHashes` set before calling an instance without (global instance).*


#### Parameters

 - `targetHashes` (Optional) - Accepts a string or an array of strings defining anchor links (minus the `#`) that should be targeted for this instance.
 
 - `opts` (Optional) - Accepts an object of options you can define to change the behavior of hashjump. ([See Options Section](#options))


#### Examples

```js
document.addEventListener('DOMContentLoaded', function () {
  hashjump('section-2', {
    hideUrlHash: true,
    focusElement: true
  })

  hashjump('section-4', {
    easingFunction: function (t) { return d3.easeElasticInOut(t) },
    scrollDuration: 2000,
    scrollOffset: 'inner-50%'
  })

  hashjump({
    actionAfter: function (info) { console.log(info) }
  })
})
```


### `hashjump.to` Function

`hashjump.to([target], [opts])`

`hashjump.to([opts])`

Scrolls to the specified `target`. Retains any `opts` that may have been previously set by the `hashjump()` init function but can be overwritten with the `opts` parameter.


### Paramters

 - `target` - Accepts a string of the anchor link or element ID (minus the `#`), an instance of HTMLElement, or null to use the document body as the element to scroll to.

 - `opts` (Optional) - Accepts an object of options you can define to change the behavior of hashjump. ([See Options Section](#options))


### Options

#### action

A function that will replace the scroll event and gets passed an object as the only parameter with some useful information about the instance ([See Action Info Section](#action-info)). Useful for performing an action other than scrolling to an element when an anchor link is clicked or visited.


#### actionAfter

A function that will be ran after the scroll event and gets passed an object as the only parameter with some useful information about the instance ([See Action Info Section](#action-info)).


#### actionBefore

A function that will be ran before the scroll event and gets passed an object as the only parameter with some useful information about the instance ([See Action Info Section](#action-info)). If this function returns `false`, the scroll event will not occur.


#### focusElement

Decides if the element should be focused after the scroll event or not. Accepts a selector string that is passed to `element.matches`, a custom function that is passed the element as it's only parameter and should return boolean, or a boolean.


#### hashjumpLinks

Decides if anchor links on the page should have `hashjumpLinkEvents` attached to them that runs the `hashjump.to()` function. Accepts a boolean.

*Note: This option is only used by the `hashjump()` init function.*


#### hashjumpLinkEvents

An array of strings defining event listener types that should be attached to anchor links if the `hashjumpLinks` option is set to `true`.

*Note: This option is only used by the `hashjump()` init function.*


#### hashjumpOnLoad

Decides if a load event listener should be attached to the window that runs the `hashjump.to()` function when the page was visited with an anchor link. Accepts a boolean.

*Note: This option is only used by the `hashjump()` init function.*


#### hideUrlHash

Decides if the anchor id should be displayed in the address bar. Accepts a boolean.

*Note: This option is only used by the `hashjump()` init function.*


#### ignoreEmptyHashes

Decides if an anchor link with an empty hash should be ignored.

*Note: This option is only used by the `hashjump()` init function.*


#### scrollOffset

The amount of pixels offset to the viewport and element position that the window should scroll to. For example, an offset of 5 would scroll the window to where the top of the element ends up at 5 pixels from the top of the viewport.

A string ending with a `%` can be passed to use a percentage based on the viewport rather than a specific pixel value. For example an offset of "25%" would scroll the window to where the top of the element ends up 25% from the top of the viewport.

Lastly, a string begining with `inner-` and ending with a `%` can be passed to use a percentage based on the viewport and the element size. For example, an offset of "inner-50%" would scroll the window to where the center of the element ends up in the center of the viewport.


#### scrollOffsetX

Does the same as the `scrollOffset` option but only for the horizontal axis. (Falls back to `scrollOffset` if left blank)


#### scrollOffsetY

Does the same as the `scrollOffset` option but only for the vertical axis. (Falls back to `scrollOffset` if left blank)


#### scrollDuration

The number of milliseconds the scroll event should take.


#### scrollDurationOnLoad

The number of milliseconds the scroll event should take on page load. (Falls back to `scrollDuration` if left blank)


#### scrollDurationOnClick

The number of milliseconds the scroll event should take on anchor link click. (Falls back to `scrollDuration` if left blank)


#### easingFunction

The easing function used to animate the scroll event. Accepts a custom function that is passed the specified normalized time (`t`) as it's only parameter. This is useful if you wish to use an easing function from something like [d3-ease].

This option also accepts a string to set the easing function to one of the easing functions that hashjump comes with built-in. These include: `linear`, `easeInQuad`, `easeOutQuad`, `easeInOutQuad`, `easeInCubic`, `easeOutCubic`, `easeInOutCubic`, `easeInQuart`, `easeOutQuart`, `easeInOutQuart`, `easeInQuint`, `easeOutQuint`, and `easeInOutQuint`.


### Default Options

```js
{
  action: null,
  actionAfter: null,
  actionBefore: null,
  focusElement: 'input, select, button, textarea',
  hashjumpLinks: true,
  hashjumpLinkEvents: ['click', 'keypress'],
  hashjumpOnLoad: true,
  hideUrlHash: false,
  ignoreEmptyHashes: true,
  scrollOffset: '25%',
  scrollOffsetX: null,
  scrollOffsetY: null,
  scrollDuration: 200,
  scrollDurationOnLoad: null,
  scrollDurationOnClick: null,
  easingFunction: 'linear'
}
```

### Action Info

This is an example of the object that is passed to functions defined in the `action`, `actionAfter`, and `actionBefore` options.

```js
{
  duration: 200
  easeFunc: ƒ easeFunc(t)
  element: div#table-of-contents
  elementHeight: 270
  elementPosX: 127
  elementPosY: 471
  elementWidth: 832
  focusElement: ƒ focusElement()
  maxScrollX: 0
  maxScrollY: 2000
  opts: {...}
  pageHeight: 2895
  pageWidth: 1086
  requestAnimationFrame: ƒ requestAnimationFrame()
  scrollOffsetX: 271.5
  scrollOffsetY: 223.75
  scrollPointX: 0
  scrollPointY: 247.25
  scrollStartX: 0
  scrollStartY: 806.5
  step: ƒ step()
  target: "table-of-contents"
  time: 1678033694771
  viewHeight: 895
  viewWidth: 1086
}
```


## Related

 - [filebokz](https://github.com/kodie/filebokz) - A tiny, dependency-free, highly customizable and configurable, easy to use file input with some pretty sweet features.

 - [minitaur](https://github.com/kodie/minitaur) - The ultimate, dependency-free, easy to use, JavaScript plugin for creating and managing modals.

 - [colorfield](https://github.com/kodie/colorfield) - A tiny, dependency-free, color input field helper that utilizes the native color picker.

 - [vanishing-fields](https://github.com/kodie/vanishing-fields) - A dependency-free, easy to use, JavaScript plugin for hiding and showing fields.


## License

MIT. See the [license file](license.md) for more info.


[d3-ease]: https://github.com/d3/d3-ease