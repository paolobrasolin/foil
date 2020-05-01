const winston = require("winston");

const DEFAULT_LEVEL = 'info';

const consoleTransport = new winston.transports.Console({ level: DEFAULT_LEVEL });

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [consoleTransport],
});

const adjustLevel = (delta) => {
  const levels = Object.keys(consoleTransport.levels)
  const oldLevel = consoleTransport.level
  const oldLevelIdx = consoleTransport.levels[oldLevel]
  const newLevelIdx = Math.max(Math.min(oldLevelIdx + delta, levels.length - 1),0)
  const newLevel = levels[newLevelIdx]
  consoleTransport.level = newLevel
  logger.debug(`Adjusted logging level from ${oldLevel} to ${newLevel}`)
}

module.exports = {
  logger: logger,
  adjustLevel: adjustLevel,
};
