var log4js = require("log4js");

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
