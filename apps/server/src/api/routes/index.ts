import { AuthenticatedRequest } from '@auth-backend';
import { Response, NextFunction } from 'express';
import { MissingInputError, ResourceNotFoundError } from '@offisito-shared';

export interface APIResponse {
  statusCode: number;
  body: {};
}

export default (handler: (req: AuthenticatedRequest) => Promise<APIResponse>) =>
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { statusCode, body } = await handler(req);
      if (statusCode >= 500) throw Error('Internal Server Error');
      const ret = res.status(statusCode);
      return typeof body === 'string' ? ret.send(body) : ret.json(body);
    } catch (err) {
      const findError = identifyError(err);
      if (findError) {
        const ret = res.status(findError.statusCode);
        return ret.send(findError.body);
      }
      next(err);
    }
  };

const identifyError = (error: Error): APIResponse => {
  if (error instanceof MissingInputError) {
    return { statusCode: 400, body: error.message };
  }
  if (error instanceof ResourceNotFoundError) {
    return { statusCode: 404, body: error.message };
  }

  return undefined;
};
