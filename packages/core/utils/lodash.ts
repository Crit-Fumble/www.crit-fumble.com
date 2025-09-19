/**
 * Selective Lodash Re-exports
 * 
 * Only export the lodash functions we actually use to avoid bloat.
 * Tree-shaking friendly approach.
 */

// Import specific functions instead of the entire library
import get from 'lodash/get';
import set from 'lodash/set';
import merge from 'lodash/merge';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import pick from 'lodash/pick';
import omit from 'lodash/omit';
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
import camelCase from 'lodash/camelCase';
import kebabCase from 'lodash/kebabCase';
import upperFirst from 'lodash/upperFirst';

// Re-export only what we need
export {
  get,
  set,
  merge,
  cloneDeep,
  isEqual,
  isEmpty,
  pick,
  omit,
  debounce,
  throttle,
  camelCase,
  kebabCase,
  upperFirst
};

// Create a namespace export for convenience
export const _ = {
  get,
  set,
  merge,
  cloneDeep,
  isEqual,
  isEmpty,
  pick,
  omit,
  debounce,
  throttle,
  camelCase,
  kebabCase,
  upperFirst
};