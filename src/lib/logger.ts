/**
 * Structured logging utility for StoryVerse
 * Provides consistent log format across the application
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  userId?: string;
  requestId?: string;
  [key: string]: unknown;
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

class Logger {
  private minLevel: LogLevel;
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.minLevel = this.isDevelopment ? 'debug' : 'info';
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[this.minLevel];
  }

  private formatEntry(entry: LogEntry): string {
    if (this.isDevelopment) {
      // Pretty format for development
      const parts = [`[${entry.level.toUpperCase()}]`, entry.message];
      if (entry.context && Object.keys(entry.context).length > 0) {
        parts.push(JSON.stringify(entry.context, null, 2));
      }
      if (entry.error) {
        parts.push(`\nError: ${entry.error.message}`);
        if (entry.error.stack) {
          parts.push(entry.error.stack);
        }
      }
      return parts.join(' ');
    }

    // JSON format for production (structured logging)
    return JSON.stringify(entry);
  }

  private log(level: LogLevel, message: string, context?: LogContext, error?: Error): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
    };

    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    }

    const formatted = this.formatEntry(entry);

    switch (level) {
      case 'debug':
      case 'info':
        // In production, use console.log for structured logging services
        // eslint-disable-next-line no-console
        console.log(formatted);
        break;
      case 'warn':
        console.warn(formatted);
        break;
      case 'error':
        console.error(formatted);
        break;
    }

    // In production, you would send to external logging service here
    // Example: sendToLoggingService(entry);
  }

  debug(message: string, context?: LogContext): void {
    this.log('debug', message, context);
  }

  info(message: string, context?: LogContext): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context);
  }

  error(message: string, error?: Error, context?: LogContext): void {
    this.log('error', message, context, error);
  }

  /**
   * Log API request
   */
  apiRequest(method: string, path: string, context?: LogContext): void {
    this.info(`API ${method} ${path}`, { ...context, type: 'api_request' });
  }

  /**
   * Log API response
   */
  apiResponse(method: string, path: string, status: number, durationMs: number): void {
    const level = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info';
    this.log(level, `API ${method} ${path} → ${status} (${durationMs}ms)`, {
      type: 'api_response',
      status,
      durationMs,
    });
  }

  /**
   * Log user action
   */
  userAction(action: string, userId?: string, details?: Record<string, unknown>): void {
    this.info(`User action: ${action}`, { type: 'user_action', userId, ...details });
  }

  /**
   * Log business event
   */
  businessEvent(event: string, data?: Record<string, unknown>): void {
    this.info(`Event: ${event}`, { type: 'business_event', ...data });
  }
}

// Singleton instance
export const logger = new Logger();

// Export for direct use
export const { debug, info, warn, error } = {
  debug: (message: string, context?: LogContext) => logger.debug(message, context),
  info: (message: string, context?: LogContext) => logger.info(message, context),
  warn: (message: string, context?: LogContext) => logger.warn(message, context),
  error: (message: string, err?: Error, context?: LogContext) =>
    logger.error(message, err, context),
};
