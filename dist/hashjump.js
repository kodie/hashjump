(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.hashjump = factory());
})(this, (function () { 'use strict';

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      enumerableOnly && (symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      })), keys.push.apply(keys, symbols);
    }
    return keys;
  }
  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = null != arguments[i] ? arguments[i] : {};
      i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
    return target;
  }
  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }
  function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key);
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
      var res = prim.call(input, hint || "default");
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return typeof key === "symbol" ? key : String(key);
  }

  /*!
    hashjump v0.0.1 (https://github.com/kodie/hashjump)
    by Kodie Grantham (https://kodieg.com)
  */

  var hashjump = function hashjump(targetHashes, opts) {
    var _opts, _hashjump$opts;
    var onLoadHash = window.location.hash.replace('#', '');
    if (_typeof(targetHashes) === 'object') {
      opts = targetHashes;
      targetHashes = null;
    } else if (typeof targetHashes === 'string') {
      targetHashes = targetHashes.split(/[\s,]+/);
    }
    opts = Object.assign({}, hashjump.defaultOpts, (_opts = opts) !== null && _opts !== void 0 ? _opts : {});
    if (opts.hashjumpOnLoad && onLoadHash && (!targetHashes && !Object.keys((_hashjump$opts = hashjump.opts) !== null && _hashjump$opts !== void 0 ? _hashjump$opts : {}).includes(onLoadHash) || targetHashes && targetHashes.includes(onLoadHash))) {
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
      }
      window.scrollTo(0, 0);
      if (opts.hideUrlHash) {
        history.replaceState(null, null, window.location.pathname);
      }
      window.addEventListener('load', function () {
        hashjump.to(onLoadHash, Object.assign({
          isOnLoad: true
        }, opts));
      });
    }
    if (opts.hashjumpLinks) {
      var query;
      if (targetHashes) {
        query = targetHashes.map(function (hash) {
          return 'a[href="#' + hash + '"]';
        }).join(',');
      } else {
        var _hashjump$opts2;
        query = 'a[href^="#"]' + Object.keys((_hashjump$opts2 = hashjump.opts) !== null && _hashjump$opts2 !== void 0 ? _hashjump$opts2 : {}).map(function (hash) {
          return ':not([href="#' + hash + '"])';
        }).join('');
      }
      var hashLinks = document.querySelectorAll(query);
      hashLinks.forEach(function (link) {
        opts.hashjumpLinkEvents.forEach(function (eventType) {
          link.addEventListener(eventType, function (e) {
            if (opts.hideUrlHash) {
              e.preventDefault();
              history.replaceState(null, null, window.location.pathname);
            }
            var linkHash = link.getAttribute('href').replace('#', '');
            hashjump.to(linkHash, Object.assign({
              isOnClick: true
            }, opts));
          });
        });
      });
    }
    if (targetHashes) {
      var _hashjump$opts3;
      hashjump.opts = Object.assign((_hashjump$opts3 = hashjump.opts) !== null && _hashjump$opts3 !== void 0 ? _hashjump$opts3 : {}, targetHashes.reduce(function (a, v) {
        return _objectSpread2(_objectSpread2({}, a), {}, _defineProperty({}, v, opts));
      }, {}));
    } else {
      hashjump.baseOpts = opts;
    }
  };
  hashjump.to = function (target, opts) {
    var _ref, _ref2, _opts2, _opts$scrollOffsetX, _opts$scrollOffsetY, _ref3, _ref4;
    var element;
    if (_typeof(target) === 'object' && !(target instanceof HTMLElement)) {
      opts = target;
      target = null;
    }
    if (!target) {
      element = document.documentElement;
    } else if (target instanceof HTMLElement) {
      element = target;
    } else if (typeof target === 'string') {
      element = document.getElementById(target);
    } else {
      console.error('[hashjump] invalid target:', target);
      return;
    }
    if (!element) {
      if (opts.action) {
        element = document.documentElement;
      } else {
        console.warn('[hashjump] could not find element:', target);
        return;
      }
    }
    var id = typeof target === 'string' ? target : element.id;
    opts = Object.assign({}, (_ref = (_ref2 = hashjump.opts ? hashjump.opts[id] : null) !== null && _ref2 !== void 0 ? _ref2 : hashjump.baseOpts) !== null && _ref !== void 0 ? _ref : hashjump.defaultOpts, (_opts2 = opts) !== null && _opts2 !== void 0 ? _opts2 : {});
    var viewWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    var viewHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    var pageWidth = document.documentElement.scrollWidth;
    var pageHeight = document.documentElement.scrollHeight;
    var maxScrollX = pageWidth - viewWidth;
    var maxScrollY = pageHeight - viewHeight;
    var elementPosX = element.offsetLeft;
    var elementPosY = element.offsetTop;
    var elementWidth = element.offsetWidth;
    var elementHeight = element.offsetHeight;
    var scrollOffsetX = (_opts$scrollOffsetX = opts.scrollOffsetX) !== null && _opts$scrollOffsetX !== void 0 ? _opts$scrollOffsetX : opts.scrollOffset;
    var scrollOffsetY = (_opts$scrollOffsetY = opts.scrollOffsetY) !== null && _opts$scrollOffsetY !== void 0 ? _opts$scrollOffsetY : opts.scrollOffset;
    if (typeof scrollOffsetX === 'string') {
      if (scrollOffsetX.startsWith('inner-')) {
        if (scrollOffsetX.charAt(scrollOffsetX.length - 1) === '%') {
          scrollOffsetX = Number(scrollOffsetX.slice(6, -1)) / 100 * (viewWidth - elementWidth);
        } else {
          scrollOffsetX = -Number(scrollOffsetX.slice(6));
        }
      } else if (scrollOffsetX.charAt(scrollOffsetX.length - 1) === '%') {
        scrollOffsetX = Number(scrollOffsetX.slice(0, -1)) / 100 * viewWidth;
      } else {
        scrollOffsetX = Number(scrollOffsetX);
      }
    }
    if (typeof scrollOffsetY === 'string') {
      if (scrollOffsetY.startsWith('inner-')) {
        if (scrollOffsetY.charAt(scrollOffsetY.length - 1) === '%') {
          scrollOffsetY = Number(scrollOffsetY.slice(6, -1)) / 100 * (viewHeight - elementHeight);
        } else {
          scrollOffsetY = -Number(scrollOffsetY.slice(6));
        }
      } else if (scrollOffsetY.charAt(scrollOffsetY.length - 1) === '%') {
        scrollOffsetY = Number(scrollOffsetY.slice(0, -1)) / 100 * viewHeight;
      } else {
        scrollOffsetY = Number(scrollOffsetY);
      }
    }
    var scrollPointX = elementPosX - scrollOffsetX;
    var scrollPointY = elementPosY - scrollOffsetY;
    if (scrollPointX < 0) {
      scrollPointX = 0;
    } else if (scrollPointX > maxScrollX) {
      scrollPointX = maxScrollX;
    }
    if (scrollPointY < 0) {
      scrollPointY = 0;
    } else if (scrollPointY > maxScrollY) {
      scrollPointY = maxScrollY;
    }
    var scrollStartX = window.scrollX || window.pageXOffset;
    var scrollStartY = window.scrollY || window.pageYOffset;
    var duration = (_ref3 = opts.isOnLoad ? opts.scrollDurationOnLoad : opts.scrollDurationOnClick) !== null && _ref3 !== void 0 ? _ref3 : opts.scrollDuration;
    var easeFunc = (_ref4 = typeof opts.easingFunction === 'string' ? hashjump.easingFunctions[opts.easingFunction] : opts.easingFunction) !== null && _ref4 !== void 0 ? _ref4 : hashjump.easingFunctions.linear;
    var time = Date.now();
    var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame;
    var focusElement = function focusElement() {
      if (opts.focusElement && (opts.focusElement === true || typeof opts.focusElement === 'string' && element.matches(opts.focusElement) || typeof opts.focusElement === 'function' && opts.focusElement(element))) {
        element.focus();
      }
    };
    var step = function step() {
      var t = Math.min(1, (Date.now() - time) / duration);
      var ease = easeFunc(t);
      var posX = scrollStartX + (scrollPointX - scrollStartX) * ease;
      var posY = scrollStartY + (scrollPointY - scrollStartY) * ease;
      window.scrollTo(posX, posY);
      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        focusElement();
        if (opts.actionAfter) {
          opts.actionAfter(actionInfo);
        }
      }
    };
    var actionInfo = {
      target: target,
      opts: opts,
      element: element,
      viewWidth: viewWidth,
      viewHeight: viewHeight,
      pageWidth: pageWidth,
      pageHeight: pageHeight,
      maxScrollX: maxScrollX,
      maxScrollY: maxScrollY,
      elementPosX: elementPosX,
      elementPosY: elementPosY,
      elementWidth: elementWidth,
      elementHeight: elementHeight,
      scrollOffsetX: scrollOffsetX,
      scrollOffsetY: scrollOffsetY,
      scrollPointX: scrollPointX,
      scrollPointY: scrollPointY,
      scrollStartX: scrollStartX,
      scrollStartY: scrollStartY,
      duration: duration,
      easeFunc: easeFunc,
      time: time,
      requestAnimationFrame: requestAnimationFrame,
      step: step,
      focusElement: focusElement
    };
    var actionBeforeResults;
    if (opts.actionBefore) {
      actionBeforeResults = opts.actionBefore(actionInfo);
    }
    if (opts.action) {
      if (actionBeforeResults !== false) {
        opts.action(actionInfo);
        if (opts.actionAfter) {
          opts.actionAfter(actionInfo);
        }
      }
    } else {
      if (actionBeforeResults !== false) {
        if (duration) {
          requestAnimationFrame(step);
        } else {
          window.scrollTo(scrollPointX, scrollPointY);
          focusElement();
          if (opts.actionAfter) {
            opts.actionAfter(actionInfo);
          }
        }
      }
    }
  };
  hashjump.defaultOpts = {
    action: null,
    actionAfter: null,
    actionBefore: null,
    focusElement: 'input, select, button, textarea',
    hashjumpLinks: true,
    hashjumpLinkEvents: ['click', 'keypress'],
    hashjumpOnLoad: true,
    hideUrlHash: false,
    scrollOffset: '25%',
    scrollOffsetX: null,
    scrollOffsetY: null,
    scrollDuration: 200,
    scrollDurationOnLoad: null,
    scrollDurationOnClick: null,
    easingFunction: 'linear'
  };
  hashjump.easingFunctions = {
    linear: function linear(t) {
      return t;
    },
    easeInQuad: function easeInQuad(t) {
      return t * t;
    },
    easeOutQuad: function easeOutQuad(t) {
      return t * (2 - t);
    },
    easeInOutQuad: function easeInOutQuad(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    easeInCubic: function easeInCubic(t) {
      return t * t * t;
    },
    easeOutCubic: function easeOutCubic(t) {
      return --t * t * t + 1;
    },
    easeInOutCubic: function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },
    easeInQuart: function easeInQuart(t) {
      return t * t * t * t;
    },
    easeOutQuart: function easeOutQuart(t) {
      return 1 - --t * t * t * t;
    },
    easeInOutQuart: function easeInOutQuart(t) {
      return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
    },
    easeInQuint: function easeInQuint(t) {
      return t * t * t * t * t;
    },
    easeOutQuint: function easeOutQuint(t) {
      return 1 + --t * t * t * t * t;
    },
    easeInOutQuint: function easeInOutQuint(t) {
      return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
    }
  };

  return hashjump;

}));
//# sourceMappingURL=hashjump.js.map
