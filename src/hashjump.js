/*!
  hashjump v0.0.2 (https://github.com/kodie/hashjump)
  by Kodie Grantham (https://kodieg.com)
*/

const hashjump = (targetHashes, opts) => {
  const onLoadHash = (window.location.hash).replace('#', '')

  if (typeof targetHashes === 'object') {
    opts = targetHashes
    targetHashes = null
  } else if (typeof targetHashes === 'string') {
    targetHashes = targetHashes.split(/[\s,]+/)
  }

  opts = Object.assign({}, hashjump.defaultOpts, opts ?? {})

  if (
    opts.hashjumpOnLoad &&
    onLoadHash &&
    (
      (!targetHashes && !Object.keys(hashjump.opts ?? {}).includes(onLoadHash)) ||
      (targetHashes && targetHashes.includes(onLoadHash))
    )
  ) {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }

    window.scrollTo(0, 0)

    if (opts.hideUrlHash || (opts.ignoreEmptyHashes && !onLoadHash)) {
      history.replaceState(null, null, window.location.pathname)
    }

    if (!opts.ignoreEmptyHashes || onLoadHash) {
      window.addEventListener('load', () => {
        hashjump.to(onLoadHash, Object.assign({ isOnLoad: true }, opts))
      })
    }
  }

  if (opts.hashjumpLinks) {
    let query

    if (targetHashes) {
      query = targetHashes.map(hash => 'a[href="#' + hash + '"]').join(',')
    } else {
      query = 'a[href^="#"]' + Object.keys(hashjump.opts ?? {}).map(hash => ':not([href="#' + hash + '"])').join('')
    }

    const hashLinks = document.querySelectorAll(query)

    hashLinks.forEach(link => {
      opts.hashjumpLinkEvents.forEach(eventType => {
        link.addEventListener(eventType, e => {
          const linkHash = link.getAttribute('href').replace('#', '')

          if (opts.hideUrlHash || (opts.ignoreEmptyHashes && !linkHash)) {
            e.preventDefault()
            history.replaceState(null, null, window.location.pathname)
          }

          if (!opts.ignoreEmptyHashes || linkHash) {
            hashjump.to(linkHash, Object.assign({ isOnClick: true }, opts))
          }
        })
      })
    })
  }

  if (targetHashes) {
    hashjump.opts = Object.assign(hashjump.opts ?? {}, targetHashes.reduce((a, v) => ({ ...a, [v]: opts }), {}))
  } else {
    hashjump.baseOpts = opts
  }
}

hashjump.to = (target, opts) => {
  let element

  if (typeof target === 'object' && !(target instanceof HTMLElement)) {
    opts = target
    target = null
  }

  if (!target) {
    element = document.documentElement
  } else if (target instanceof HTMLElement) {
    element = target
  } else if (typeof target === 'string') {
    element = document.getElementById(target)
  } else {
    console.error('[hashjump] invalid target:', target)
    return
  }

  if (!element) {
    if (opts.action) {
      element = document.documentElement
    } else {
      console.warn('[hashjump] could not find element:', target)
      return
    }
  }

  const id = typeof target === 'string' ? target : element.id

  opts = Object.assign({}, (hashjump.opts ? hashjump.opts[id] : null) ?? hashjump.baseOpts ?? hashjump.defaultOpts, opts ?? {})

  const viewWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
  const viewHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
  const pageWidth = document.documentElement.scrollWidth
  const pageHeight = document.documentElement.scrollHeight
  const maxScrollX = pageWidth - viewWidth
  const maxScrollY = pageHeight - viewHeight
  const elementPosX = element.offsetLeft
  const elementPosY = element.offsetTop
  const elementWidth = element.offsetWidth
  const elementHeight = element.offsetHeight

  let scrollOffsetX = opts.scrollOffsetX ?? opts.scrollOffset
  let scrollOffsetY = opts.scrollOffsetY ?? opts.scrollOffset

  if (typeof scrollOffsetX === 'string') {
    if (scrollOffsetX.startsWith('inner-')) {
      if (scrollOffsetX.charAt(scrollOffsetX.length - 1) === '%') {
        scrollOffsetX = ((Number(scrollOffsetX.slice(6, -1)) / 100) * (viewWidth - elementWidth))
      } else {
        scrollOffsetX = -Number(scrollOffsetX.slice(6))
      }
    } else if (scrollOffsetX.charAt(scrollOffsetX.length - 1) === '%') {
      scrollOffsetX = (Number(scrollOffsetX.slice(0, -1)) / 100) * viewWidth
    } else {
      scrollOffsetX = Number(scrollOffsetX)
    }
  }

  if (typeof scrollOffsetY === 'string') {
    if (scrollOffsetY.startsWith('inner-')) {
      if (scrollOffsetY.charAt(scrollOffsetY.length - 1) === '%') {
        scrollOffsetY = ((Number(scrollOffsetY.slice(6, -1)) / 100) * (viewHeight - elementHeight))
      } else {
        scrollOffsetY = -Number(scrollOffsetY.slice(6))
      }
    } else if (scrollOffsetY.charAt(scrollOffsetY.length - 1) === '%') {
      scrollOffsetY = (Number(scrollOffsetY.slice(0, -1)) / 100) * viewHeight
    } else {
      scrollOffsetY = Number(scrollOffsetY)
    }
  }

  let scrollPointX = elementPosX - scrollOffsetX
  let scrollPointY = elementPosY - scrollOffsetY

  if (scrollPointX < 0) {
    scrollPointX = 0
  } else if (scrollPointX > maxScrollX) {
    scrollPointX = maxScrollX
  }

  if (scrollPointY < 0) {
    scrollPointY = 0
  } else if (scrollPointY > maxScrollY) {
    scrollPointY = maxScrollY
  }

  const scrollStartX = window.scrollX || window.pageXOffset
  const scrollStartY = window.scrollY || window.pageYOffset
  const duration = (opts.isOnLoad ? opts.scrollDurationOnLoad : opts.scrollDurationOnClick) ?? opts.scrollDuration
  const easeFunc = (typeof opts.easingFunction === 'string' ? hashjump.easingFunctions[opts.easingFunction] : opts.easingFunction) ?? hashjump.easingFunctions.linear
  const time = Date.now()
  const requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame

  const focusElement = () => {
    if (
      opts.focusElement &&
      (
        opts.focusElement === true ||
        (typeof opts.focusElement === 'string' && element.matches(opts.focusElement)) ||
        (typeof opts.focusElement === 'function' && opts.focusElement(element))
      )
    ) {
      element.focus()
    }
  }

  const step = () => {
    const t = Math.min(1, (Date.now() - time) / duration)
    const ease = easeFunc(t)
    const posX = scrollStartX + (scrollPointX - scrollStartX) * ease
    const posY = scrollStartY + (scrollPointY - scrollStartY) * ease

    window.scrollTo(posX, posY)

    if (t < 1) {
      requestAnimationFrame(step)
    } else {
      focusElement()

      if (opts.actionAfter) {
        opts.actionAfter(actionInfo)
      }
    }
  }

  const actionInfo = {
    target,
    opts,
    element,
    viewWidth,
    viewHeight,
    pageWidth,
    pageHeight,
    maxScrollX,
    maxScrollY,
    elementPosX,
    elementPosY,
    elementWidth,
    elementHeight,
    scrollOffsetX,
    scrollOffsetY,
    scrollPointX,
    scrollPointY,
    scrollStartX,
    scrollStartY,
    duration,
    easeFunc,
    time,
    requestAnimationFrame,
    step,
    focusElement
  }

  let actionBeforeResults

  if (opts.actionBefore) {
    actionBeforeResults = opts.actionBefore(actionInfo)
  }

  if (opts.action) {
    if (actionBeforeResults !== false) {
      opts.action(actionInfo)

      if (opts.actionAfter) {
        opts.actionAfter(actionInfo)
      }
    }
  } else {
    if (actionBeforeResults !== false) {
      if (duration) {
        requestAnimationFrame(step)
      } else {
        window.scrollTo(scrollPointX, scrollPointY)
        focusElement()

        if (opts.actionAfter) {
          opts.actionAfter(actionInfo)
        }
      }
    }
  }
}

hashjump.defaultOpts = {
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

hashjump.easingFunctions = {
  linear: t => t,
  easeInQuad: t => t * t,
  easeOutQuad: t => t * (2 - t),
  easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeInCubic: t => t * t * t,
  easeOutCubic: t => (--t) * t * t + 1,
  easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeInQuart: t => t * t * t * t,
  easeOutQuart: t => 1 - (--t) * t * t * t,
  easeInOutQuart: t => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
  easeInQuint: t => t * t * t * t * t,
  easeOutQuint: t => 1 + (--t) * t * t * t * t,
  easeInOutQuint: t => t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t
}

export default hashjump
