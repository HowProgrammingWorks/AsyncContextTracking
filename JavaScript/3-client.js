'use strict';

const http = require('node:http');

const application = {
  nextRequestId: 0,
  user: { name: 'Marcus', balance: 0 },
};

class Client {
  constructor(req, res) {
    this.req = req;
    this.res = res;
    this.id = application.nextRequestId++;
  }

  get method() {
    return this.req.method;
  }

  get url() {
    return this.req.url;
  }

  get status() {
    return this.res.statusCode;
  }
}

const routing = {
  '/': '<h1>welcome to homepage</h1><hr>',
  '/user': application.user,
  '/user/name': () => application.user.name.toUpperCase(),
  '/user/balance': () => application.user.balance,
  '/api/method1': async (client) => {
    console.log(`${client.id} ${client.method} ${client.url} ${client.status}`);
    return { id: client.id, user: application.user };
  },
};

const types = {
  object: JSON.stringify,
  string: (s) => s,
  undefined: () => 'not found',
  function: async (fn, client) => {
    const result = await fn(client);
    return JSON.stringify(result);
  },
};


http.createServer(async (req, res) => {
  const data = routing[req.url];
  const type = typeof data;
  const endpoint = types[type];
  const client = new Client(req, res);
  const result = await endpoint(data, client);
  res.end(result);
}).listen(8000);

setInterval(() => {
  application.user.balance += 10;
}, 1000);
