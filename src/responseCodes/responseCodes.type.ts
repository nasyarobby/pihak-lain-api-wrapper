export type ResponseCode = {
  code: Uppercase<string>;
  message: string;
  status: 'success' | 'fail' | 'error';
};
