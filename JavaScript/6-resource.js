'use strict';

const { AsyncResource, executionAsyncId } = require('node:async_hooks');

const resource1 = new AsyncResource('name');
const resource2 = new AsyncResource('name');

console.log({ resource1 });
console.log({ resource2 });

const fn = () => {
  const id = executionAsyncId();
  console.log({ id });
};

fn();
resource1.runInAsyncScope(fn);
resource2.runInAsyncScope(fn);
fn();
