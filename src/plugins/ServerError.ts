import ApiError from './ApiError.js';

class ServerError extends ApiError {
  constructor(
    config: {
      message: string,
      code: Uppercase<string>;
      data?: any;
      originalError?: Error },
  ) {
    super({ ...config, status: 'error' });
  }
}

export default ServerError;
