const generate = require("./server/misc/account-gen");

test('generates account number like 1234-5678-9012-3456', () => {
  expect(generate()).toBe('1234-5678-9012-3456');
});