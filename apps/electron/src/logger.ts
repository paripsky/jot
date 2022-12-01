import { ipcMain } from 'electron';

export const logger = {
  log: console.log,
  info: console.info,
  warn: console.warn,
  error: console.error,
};

const logTypesArr = Object.keys(logger) as (keyof typeof logger)[];

logTypesArr.forEach((logType) => {
  ipcMain.on(`logger.${logType}`, (_, ...args) => {
    logger[logType](...args);
  });
});

export type LoggerFunctions = typeof logger;
