'use strict';

const { AsyncLocalStorage } = require('node:async_hooks');

const application = {
  asyncLocalStorage: new AsyncLocalStorage(),
  state: {
    marcus: { name: 'Marcus', balance: 1000 },
    lucius: { name: 'Lucius', balance: 1000 },
  },
  api: {
    pay: async (from, to, amount) => {
      const id = application.asyncLocalStorage.getStore();
      const { available } = await application.api.check(from, amount);
      if (!available) return { id, amount: 0, success: false };
      const { money } = await application.api.withdraw(from, amount);
      await application.api.topup(to, money);
      return { id, amount, success: true };
    },
    withdraw: async (account, amount) => {
      const id = application.asyncLocalStorage.getStore();
      account.balance -= amount;
      return { id, money: amount };
    },
    topup: async (account, amount) => {
      const id = application.asyncLocalStorage.getStore();
      account.balance += amount;
      return { id, money: amount };
    },
    check: async (account, amount) => {
      const id = application.asyncLocalStorage.getStore();
      const available = account.balance >= amount;
      return { id, available };
    },
  },
};

const test = async () => {
  console.time('test');
  const { marcus, lucius } = application.state;
  for (let i = 0; i < 1000000; i++) {
    application.asyncLocalStorage.run(i, async () => {
      await application.api.pay(marcus, lucius, 150);
      await application.api.pay(lucius, marcus, 200);
      await application.api.pay(marcus, lucius, 250);
      await application.api.pay(lucius, marcus, 400);
      await application.api.pay(marcus, lucius, 200);
    });
  }
  console.log(application.state);
  console.timeEnd('test');
};

test();
