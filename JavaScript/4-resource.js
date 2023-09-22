'use strict';

const { AsyncResource, executionAsyncId } = require('node:async_hooks');

const asyncResource1 = new AsyncResource(
  'user', { triggerAsyncId: executionAsyncId(), requireManualDestroy: false },
);

console.log({ asyncResource1 });

const asyncResource2 = new AsyncResource(
  'user', { triggerAsyncId: executionAsyncId(), requireManualDestroy: false },
);

console.log({ asyncResource2 });

const fn = () => {
  const id = executionAsyncId();
  console.log({ id });
};

asyncResource1.runInAsyncScope(fn);
asyncResource2.runInAsyncScope(fn);
