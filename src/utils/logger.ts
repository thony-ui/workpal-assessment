import pino from "pino";

const logger = pino({
  transport: {
    target: "pino-pretty", // pretty-print to console
    options: {
      colorize: true,
      translateTime: "SYS:standard",
      ignore: "pid,hostname",
    },
  },
});

export default logger;
