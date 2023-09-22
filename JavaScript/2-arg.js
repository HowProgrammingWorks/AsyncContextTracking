'use strict';

const http = require('node:http');

const application = {
  nextRequestId: 0,
  user: { name: 'Marcus', balance: 0 },
};

const routing = {
  '/': '<h1>welcome to homepage</h1><hr>',
  '/user': application.user,
  '/user/name': () => application.user.name.toUpperCase(),
  '/user/age': () => application.user.age,
  '/api/method1': async (req, res, id) => {
    console.log(`${id} ${req.method} ${req.url} ${res.statusCode}`);
    return { id, user: application.user };
  },
};

const types = {
  object: JSON.stringify,
  string: (s) => s,
  undefined: () => 'not found',
  function: async (fn, req, res, id) => {
    const result = await fn(req, res, id);
    return JSON.stringify(result);
  },
};


http.createServer(async (req, res) => {
  const data = routing[req.url];
  const type = typeof data;
  const endpoint = types[type];
  const id = application.nextRequestId++;
  const result = await endpoint(data, req, res, id);
  res.end(result);
}).listen(8000);

setInterval(() => {
  application.user.balance += 10;
}, 1000);
