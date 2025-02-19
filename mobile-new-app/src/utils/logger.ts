import { Platform } from 'react-native';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private static instance: Logger;
  private isDevelopment: boolean;

  private constructor() {
    this.isDevelopment = __DEV__;
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatMessage(level: LogLevel, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const platform = Platform.OS;
    const dataString = data ? `\nData: ${JSON.stringify(data, null, 2)}` : '';
    return `[${timestamp}][${platform}][${level.toUpperCase()}] ${message}${dataString}`;
  }

  public debug(message: string, data?: any): void {
    if (this.isDevelopment) {
      console.debug(this.formatMessage('debug', message, data));
    }
  }

  public info(message: string, data?: any): void {
    if (this.isDevelopment) {
      console.info(this.formatMessage('info', message, data));
    }
  }

  public warn(message: string, data?: any): void {
    console.warn(this.formatMessage('warn', message, data));
  }

  public error(message: string, error?: any): void {
    console.error(this.formatMessage('error', message, error));
    if (error?.response) {
      console.error('Response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    }
  }
}

export const logger = Logger.getInstance(); 