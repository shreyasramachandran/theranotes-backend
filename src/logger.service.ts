/* eslint-disable prettier/prettier */
import pino, { LoggerOptions } from 'pino';

interface PinoOptions extends LoggerOptions {
  prettyPrint?: { colorize?: boolean };
  timestamp?: () => string;
}

export class LoggerService {
  private logger = pino({
    prettyPrint: { colorize: true },
    timestamp: () => `,"time":"${new Date().toLocaleString()}"`,
  } as PinoOptions);

  private getClassName(): string | undefined {
    const stack = new Error().stack;
    if (stack) {
      const matches = stack.match(/\s+at\s+(\S+)/);
      if (matches) {
        const parts = matches[1].split('.');
        return parts[parts.length - 1];
      }
    }
    return undefined;
  }

  log(message: string): void {
    const className = this.getClassName();
    this.logger.info({ class: className }, message);
  }

  error(message: string, error?: Error): void {
    const className = this.getClassName();
    this.logger.error({ class: className, error }, message);
  }

  warn(message: string, context?: string) {
    this.logger.warn({ message, context });
  }

  debug(message: string, context?: string) {
    this.logger.debug({ message, context });
  }
}
