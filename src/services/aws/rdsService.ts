import { AWSError, RDS } from 'aws-sdk';
import { inject, injectable } from 'inversify';
import { Logger } from 'winston';
import { types } from '../../ioc/types';

@injectable()
export class RDSService {
  public constructor(
    @inject(types.RDSSigner) private rds: RDS.Signer,
    @inject(types.logger) private logger: Logger,
  ) { }

  public getConnectionToken(): Promise<string> {
    try {
      return this.getAuthToken();
    } catch (err) {
      this.logger.error(err);
    }

    return null;
  }

  private getAuthToken(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.rds.getAuthToken(null, (error: AWSError, token: string) => (error ? reject(error) : resolve(token)));
    });
  }
}
