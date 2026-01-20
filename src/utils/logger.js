const logger = {
    info: (msg) => console.log(`[INFO] ${msg}`),
    error: (msg, error) => console.error(`[ERROR] ${msg}`, error || ''),
    warn: (msg) => console.warn(`[WARN] ${msg}`),
};

module.exports = logger;
