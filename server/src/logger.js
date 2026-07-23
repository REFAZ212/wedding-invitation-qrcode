const LEVELS = { debug: 0, info: 1, warn: 2, error: 3 };
const currentLevel = LEVELS[process.env.LOG_LEVEL || "info"] ?? LEVELS.info;

function format(level, msg, meta) {
  const ts = new Date().toISOString();
  const base = `${ts} [${level.toUpperCase()}] ${msg}`;
  if (meta && Object.keys(meta).length > 0) {
    return `${base} ${JSON.stringify(meta)}`;
  }
  return base;
}

export const logger = {
  debug: (msg, meta) => currentLevel <= 0 && console.debug(format("debug", msg, meta)),
  info: (msg, meta) => currentLevel <= 1 && console.log(format("info", msg, meta)),
  warn: (msg, meta) => currentLevel <= 2 && console.warn(format("warn", msg, meta)),
  error: (msg, meta) => currentLevel <= 3 && console.error(format("error", msg, meta)),
};
