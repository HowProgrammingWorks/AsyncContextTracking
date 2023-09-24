'use strict';

const asyncHooks = require('node:async_hooks');
const fs = require('node:fs');
const { fd } = process.stdout;

const log = (obj) => {
  const pair = ([key, val]) => key + ': ' + JSON.stringify(val);
  const msg = Object.entries(obj).map(pair).join(', ');
  fs.writeSync(fd, `{ ${msg} }\n`);
};

const ah = asyncHooks.createHook({
  init(asyncId, type, triggerAsyncId) {
    const id = asyncHooks.executionAsyncId();
    log({ id, hook: 'init', asyncId, type, triggerAsyncId });
  },
  before(asyncId) {
    const id = asyncHooks.executionAsyncId();
    log({ id, hook: 'before', asyncId });
  },
  after(asyncId) {
    const id = asyncHooks.executionAsyncId();
    log({ id, hook: 'after', asyncId });
  },
  destroy(asyncId) {
    const id = asyncHooks.executionAsyncId();
    log({ id, hook: 'destroy', asyncId });
  },
  promiseResolve(asyncId) {
    const id = asyncHooks.executionAsyncId();
    log({ id, hook: 'promiseResolve', asyncId });
  },
});

ah.enable();

fs.readFile('./6-hooks.js', async (error, data) => {
  log({ length: data.length });
});
