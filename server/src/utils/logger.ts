import * as winston from "winston";

const NODE_ENV = process.env.NODE_ENV ?? "PROD";

const LOG_LEVELS: Record<string, string> = {
  error: 'error.log',
  warn: 'warn.log',
  info: 'info.log',
  http: 'http.log',
};

const transports = Object.keys(LOG_LEVELS).map(level =>
  new winston.transports.File({ filename: LOG_LEVELS[level], level })
);

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.printf(({ level, message, timestamp }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: transports,
});

if (NODE_ENV === "DEV") {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

export default logger;
