import winston from 'winston';

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({level: 'warn'}),
    new winston.transports.File({filename: `${__dirname  }/../log/error.log`, level: 'error'})
  ]
});

export default {
  warn: logger.warn,
  info: logger.info,
  error: logger.error,
};
