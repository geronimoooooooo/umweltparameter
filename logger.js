
// const log4js = require("log4js");
import log4js from "log4js";
const logger = log4js.getLogger("thing");
//use in the other file: const { logger } = require("./logger");

log4js.configure({
  appenders: {
    out: {
      type: "stdout",
      layout: {
        type: "pattern",
        // Output will include filename and line number
        // %n %c
        // pattern: "%d %p : %m [%f{1}.%M():%l] ",
        pattern: "%d %p : %m ",
      },
    },
  },
  categories: {
    default: { appenders: ["out"], level: "info", enableCallStack: true },
  },
});
// logger.info("this should give me a line number now");

// module.exports = {logger}
export {logger}



