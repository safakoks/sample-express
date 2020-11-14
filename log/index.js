/*
MIT License

Copyright (c) 2020 Şafak Öksüzer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
*/

const log4js = require("log4js");

log4js.configure({
  appenders: {
    errorFile: { type: "file", filename: "server-error.log" },
    out: { type: "stdout" },
  },
  categories: {
    default: { appenders: ["errorFile"], level: "error" },
    server: {
      appenders: ["out"],
      level: "info",
    },
    record: {
      appenders: ["out"],
      level: "info",
    },
    mongo: {
      appenders: ["out"],
      level: "info",
    },
  },
});

/**
 * Create a new logger
 * @param {String} name
 */
function newLogger(name) {
  if (!name) {
    throw new Error("Logger must have a name");
  }

  const logger = log4js.getLogger(name);

  return logger;
}

module.exports = { newLogger };
