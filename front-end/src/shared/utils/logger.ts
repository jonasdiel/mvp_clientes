import pino from 'pino';

const isDevelopment = import.meta.env.MODE === 'development';

export const logger = pino({
  level: import.meta.env.VITE_LOG_LEVEL || 'info',
  browser: {
    asObject: true,
    serialize: true,
    transmit: isDevelopment
      ? undefined
      : {
          level: 'error',
          send: (level, logEvent) => {
            // Aqui você pode enviar logs para um serviço externo
            // Por exemplo: Sentry, LogRocket, etc.
            console.error('Log to external service:', logEvent);
          },
        },
  },
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
  timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
  base: {
    env: import.meta.env.MODE,
  },
});

// Helper functions for structured logging
export const logError = (error: Error, context?: Record<string, unknown>) => {
  logger.error({
    message: error.message,
    stack: error.stack,
    name: error.name,
    ...context,
  });
};

export const logInfo = (message: string, context?: Record<string, unknown>) => {
  logger.info({
    message,
    ...context,
  });
};

export const logWarn = (message: string, context?: Record<string, unknown>) => {
  logger.warn({
    message,
    ...context,
  });
};

export const logDebug = (
  message: string,
  context?: Record<string, unknown>
) => {
  logger.debug({
    message,
    ...context,
  });
};
