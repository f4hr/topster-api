#! /usr/bin/env node

'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const index_1 = __importDefault(require('../dist/index'));
const port = process.env.PORT || 5000;
const address = '0.0.0.0';
(0, index_1.default)().then((app) => {
  app.listen(port, address, () => {
    console.log(`Server has been started on ${port}`);
  });
});
