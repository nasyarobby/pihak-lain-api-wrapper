import ApiError from './ApiError.js';

export default class ClientError extends ApiError {
  constructor(
    config: {
      message: string,
      code: Uppercase<string>,
      data?: any,
      originalError?: Error,
    },
  ) {
    super({ ...config, status: 'fail' });
  }
}
