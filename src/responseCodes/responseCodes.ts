import { ResponseCode } from './responseCodes.type.js';

enum ResponseCodeEnum {
  SUCCESS = 'SUCCESS',
  CLIENT_ERROR = 'CLIENT_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
}

const RESPONSE_CODES: Record<ResponseCodeEnum, ResponseCode> = {
  SUCCESS: { code: 'SUCCESS', message: 'Sukses', status: 'success' },
  CLIENT_ERROR: { code: 'ERROR_001', message: 'Terdapat kekurangan parameter.', status: 'fail' },
  SERVER_ERROR: { code: 'DB_ERR_099', message: 'Terjadi kesalahan pada server', status: 'error' },
};

export default RESPONSE_CODES;
