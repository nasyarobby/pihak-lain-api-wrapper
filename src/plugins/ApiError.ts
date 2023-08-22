import { ResponseCode } from '../responseCodes/responseCodes.type';

export default class ApiError extends Error {
  data: any;

  status: 'success' | 'fail' | 'error';

  code: string;

  originalError: { name: string; message: string; stack?: string } | undefined;

  constructor(config: ResponseCode & { status: 'fail' | 'error', data?: any; originalError?: Error }) {
    super(config.message);
    this.status = config.status;
    this.code = config.code;
    this.name = this.constructor.name;
    this.data = (config && config.data) || null;
    this.originalError = (config
        && config.originalError ? {
        name: config.originalError.name,
        message: config.originalError.message,
        stack: config.originalError.stack,
      } : undefined)
      || undefined;
  }
}
