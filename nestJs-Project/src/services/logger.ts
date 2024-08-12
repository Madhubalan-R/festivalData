import { createLogger, format, transports } from 'winston';
import * as path from 'path';
import 'winston-daily-rotate-file';

const logDirectory = path.resolve(__dirname, '..', 'logs');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [
    new transports.Console(),
    new transports.DailyRotateFile({
      filename: path.join(logDirectory, 'application-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
    }),
  ],
});

export default logger;
