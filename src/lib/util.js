import $ from 'licia/$'
import $attr from 'licia/$attr'
import $class from 'licia/$class'
import $css from 'licia/$css'
import $data from 'licia/$data'
import $event from 'licia/$event'
import $insert from 'licia/$insert'
import $offset from 'licia/$offset'
import $property from 'licia/$property'
import $remove from 'licia/$remove'
import $safeEls from 'licia/$safeEls'
import $show from 'licia/$show'
import Class from 'licia/Class'
import Emitter from 'licia/Emitter'
import Enum from 'licia/Enum'
import LocalStore from 'licia/LocalStore'
import Logger from 'licia/Logger'
import MediaQuery from 'licia/MediaQuery'
import MutationObserver from 'licia/MutationObserver'
import Select from 'licia/Select'
import SingleEmitter from 'licia/SingleEmitter'
import Stack from 'licia/Stack'
import Store from 'licia/Store'
import Url from 'licia/Url'
import ajax from 'licia/ajax'
import allKeys from 'licia/allKeys'
import before from 'licia/before'
import camelCase from 'licia/camelCase'
import castPath from 'licia/castPath'
import clamp from 'licia/clamp'
import clone from 'licia/clone'
import cloneDeep from 'licia/cloneDeep'
import concat from 'licia/concat'
import contain from 'licia/contain'
import copy from 'licia/copy'
import create from 'licia/create'
import createAssigner from 'licia/createAssigner'
import dateFormat from 'licia/dateFormat'
import debounce from 'licia/debounce'
import defaults from 'licia/defaults'
import defineProp from 'licia/defineProp'
import delegate from 'licia/delegate'
import detectBrowser from 'licia/detectBrowser'
import detectOs from 'licia/detectOs'
import difference from 'licia/difference'
import each from 'licia/each'
import endWith from 'licia/endWith'
import escape from 'licia/escape'
import escapeJsStr from 'licia/escapeJsStr'
import escapeRegExp from 'licia/escapeRegExp'
import extend from 'licia/extend'
import extendOwn from 'licia/extendOwn'
import extractUrls from 'licia/extractUrls'
import filter from 'licia/filter'
import flatten from 'licia/flatten'
import freeze from 'licia/freeze'
import getProto from 'licia/getProto'
import has from 'licia/has'
import highlight from 'licia/highlight'
import identity from 'licia/identity'
import idxOf from 'licia/idxOf'
import inherits from 'licia/inherits'
import isArgs from 'licia/isArgs'
import isArr from 'licia/isArr'
import isArrLike from 'licia/isArrLike'
import isBool from 'licia/isBool'
import isBrowser from 'licia/isBrowser'
import isBuffer from 'licia/isBuffer'
import isDarkMode from 'licia/isDarkMode'
import isDate from 'licia/isDate'
import isEl from 'licia/isEl'
import isEmpty from 'licia/isEmpty'
import isErr from 'licia/isErr'
import isFn from 'licia/isFn'
import isHidden from 'licia/isHidden'
import isMatch from 'licia/isMatch'
import isMiniProgram from 'licia/isMiniProgram'
import isMobile from 'licia/isMobile'
import isNaN from 'licia/isNaN'
import isNil from 'licia/isNil'
import isNull from 'licia/isNull'
import isNum from 'licia/isNum'
import isObj from 'licia/isObj'
import isPrimitive from 'licia/isPrimitive'
import isPromise from 'licia/isPromise'
import isRegExp from 'licia/isRegExp'
import isSorted from 'licia/isSorted'
import isStr from 'licia/isStr'
import isUndef from 'licia/isUndef'
import kebabCase from 'licia/kebabCase'
import keys from 'licia/keys'
import last from 'licia/last'
import linkify from 'licia/linkify'
import loadJs from 'licia/loadJs'
import lowerCase from 'licia/lowerCase'
import lpad from 'licia/lpad'
import ltrim from 'licia/ltrim'
import map from 'licia/map'
import mapObj from 'licia/mapObj'
import matcher from 'licia/matcher'
import memStorage from 'licia/memStorage'
import memoize from 'licia/memoize'
import mergeArr from 'licia/mergeArr'
import meta from 'licia/meta'
import ms from 'licia/ms'
import nextTick from 'licia/nextTick'
import noop from 'licia/noop'
import now from 'licia/now'
import objToStr from 'licia/objToStr'
import once from 'licia/once'
import optimizeCb from 'licia/optimizeCb'
import orientation from 'licia/orientation'
import partial from 'licia/partial'
import perfNow from 'licia/perfNow'
import pick from 'licia/pick'
import prefix from 'licia/prefix'
import property from 'licia/property'
import query from 'licia/query'
import raf from 'licia/raf'
import repeat from 'licia/repeat'
import restArgs from 'licia/restArgs'
import reverse from 'licia/reverse'
import root from 'licia/root'
import rtrim from 'licia/rtrim'
import safeCb from 'licia/safeCb'
import safeGet from 'licia/safeGet'
import safeSet from 'licia/safeSet'
import sameOrigin from 'licia/sameOrigin'
import slice from 'licia/slice'
import some from 'licia/some'
import sortKeys from 'licia/sortKeys'
import splitCase from 'licia/splitCase'
import startWith from 'licia/startWith'
import stringify from 'licia/stringify'
import stringifyAll from 'licia/stringifyAll'
import throttle from 'licia/throttle'
import toArr from 'licia/toArr'
import toInt from 'licia/toInt'
import toNum from 'licia/toNum'
import toSrc from 'licia/toSrc'
import toStr from 'licia/toStr'
import trim from 'licia/trim'
import type from 'licia/type'
import types from 'licia/types'
import uncaught from 'licia/uncaught'
import uniqId from 'licia/uniqId'
import unique from 'licia/unique'
import upperFirst from 'licia/upperFirst'
import values from 'licia/values'
import viewportScale from 'licia/viewportScale'
import wrap from 'licia/wrap'
import xpath from 'licia/xpath'
import evalCssUtil from './evalCss'

export function escapeJsonStr(str) {
  /* eslint-disable quotes */
  return escapeJsStr(str).replace(/\\'/g, "'").replace(/\t/g, '\\t')
}

export function safeStorage(type, memReplacement) {
  if (isUndef(memReplacement)) memReplacement = true

  let ret

  switch (type) {
    case 'local':
      ret = window.localStorage
      break
    case 'session':
      ret = window.sessionStorage
      break
  }

  try {
    // Safari private browsing
    const x = 'test-localStorage-' + Date.now()
    ret.setItem(x, x)
    const y = ret.getItem(x)
    ret.removeItem(x)
    if (y !== x) throw new Error()
  } catch (e) {
    if (memReplacement) return memStorage
    return
  }

  return ret
}

export function getFileName(url) {
  let ret = last(url.split('/'))

  if (ret.indexOf('?') > -1) ret = trim(ret.split('?')[0])

  if (ret === '') {
    url = new Url(url)
    ret = url.hostname
  }

  return ret
}

export function pxToNum(str) {
  return toNum(str.replace('px', ''))
}

export function isErudaEl(el) {
  let parentNode = el.parentNode

  if (!parentNode) return false

  while (parentNode) {
    parentNode = parentNode.parentNode
    if (parentNode && parentNode.id === 'eruda') return true
  }

  return false
}

export const evalCss = evalCssUtil

// To be removed in 3.0.0
export {
  $,
  $attr,
  $class,
  $css,
  $data,
  $event,
  $insert,
  $offset,
  $property,
  $remove,
  $safeEls,
  $show,
  Class,
  Emitter,
  Enum,
  LocalStore,
  Logger,
  MediaQuery,
  MutationObserver,
  Select,
  SingleEmitter,
  Stack,
  Store,
  Url,
  ajax,
  allKeys,
  before,
  camelCase,
  castPath,
  clamp,
  clone,
  cloneDeep,
  concat,
  contain,
  copy,
  create,
  createAssigner,
  dateFormat,
  debounce,
  defaults,
  defineProp,
  delegate,
  detectBrowser,
  detectOs,
  difference,
  each,
  endWith,
  escape,
  escapeJsStr,
  escapeRegExp,
  extend,
  extendOwn,
  extractUrls,
  filter,
  flatten,
  freeze,
  getProto,
  has,
  highlight,
  identity,
  idxOf,
  inherits,
  isArgs,
  isArr,
  isArrLike,
  isBool,
  isBrowser,
  isBuffer,
  isDarkMode,
  isDate,
  isEl,
  isEmpty,
  isErr,
  isFn,
  isHidden,
  isMatch,
  isMiniProgram,
  isMobile,
  isNaN,
  isNil,
  isNull,
  isNum,
  isObj,
  isPrimitive,
  isPromise,
  isRegExp,
  isSorted,
  isStr,
  isUndef,
  kebabCase,
  keys,
  last,
  linkify,
  loadJs,
  lowerCase,
  lpad,
  ltrim,
  map,
  mapObj,
  matcher,
  memStorage,
  memoize,
  mergeArr,
  meta,
  ms,
  nextTick,
  noop,
  now,
  objToStr,
  once,
  optimizeCb,
  orientation,
  partial,
  perfNow,
  pick,
  prefix,
  property,
  query,
  raf,
  repeat,
  restArgs,
  reverse,
  root,
  rtrim,
  safeCb,
  safeGet,
  safeSet,
  sameOrigin,
  slice,
  some,
  sortKeys,
  splitCase,
  startWith,
  stringify,
  stringifyAll,
  throttle,
  toArr,
  toInt,
  toNum,
  toSrc,
  toStr,
  trim,
  type,
  types,
  uncaught,
  uniqId,
  unique,
  upperFirst,
  values,
  viewportScale,
  wrap,
  xpath,
}
