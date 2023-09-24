'use strict';

const application = {
  state: {
    marcus: { name: 'Marcus', balance: 1000 },
    lucius: { name: 'Lucius', balance: 1000 },
  },
  api: {
    pay: async (id, from, to, amount) => {
      const { available } = await application.api.check(id, from, amount);
      if (!available) return { id, amount: 0, success: false };
      const { money } = await application.api.withdraw(id, from, amount);
      await application.api.topup(id, to, money);
      return { id, amount, success: true };
    },
    withdraw: async (id, account, amount) => {
      account.balance -= amount;
      return { id, money: amount };
    },
    topup: async (id, account, amount) => {
      account.balance += amount;
      return { id, money: amount };
    },
    check: async (id, account, amount) => {
      const available = account.balance >= amount;
      return { id, available };
    },
  },
};

const test = async () => {
  console.time('test');
  const { marcus, lucius } = application.state;
  for (let i = 0; i < 1000000; i++) {
    await application.api.pay(i, marcus, lucius, 150);
    await application.api.pay(i, lucius, marcus, 200);
    await application.api.pay(i, marcus, lucius, 250);
    await application.api.pay(i, lucius, marcus, 400);
    await application.api.pay(i, marcus, lucius, 200);
  }
  console.log(application.state);
  console.timeEnd('test');
};

test();
