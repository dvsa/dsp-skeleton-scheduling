import { Knex, knex } from 'knex';
import { injectable, inject } from 'inversify';
import { Logger } from 'winston';
import { RDSService } from '../aws/rdsService';
import { types } from '../../ioc/types';
import { SLOTS_HOST, SLOTS_PORT, SLOTS_USERNAME } from '../../config';

@injectable()
export class SlotsConnectionService {
  private connection: Knex;

  public constructor(
    @inject(types.RDSService) private rds: RDSService,
    @inject(types.logger) private logger: Logger,
  ) { }

  public async knex(): Promise<Knex> {
    if (!this.connection) {
      await this.connect();
    }

    return this.connection;
  }

  public async destroy(): Promise<void> {
    if (this.connection) {
      await this.connection.destroy();
      this.connection = null;
    }
  }

  private async connect(): Promise<void> {
    this.logger.info('Creating connection configuration');
    const config: Knex.MySql2ConnectionConfig = await this.getKnexConfiguration();
    this.connection = knex(config);
  }

  private async getKnexConfiguration(): Promise<Knex.Config> {
    return {
      client: 'mysql2',
      connection: await this.getConnectionConfiguration(),
    };
  }

  private async getConnectionConfiguration(): Promise<Knex.MySql2ConnectionConfig> {
    return {
      host: SLOTS_HOST,
      port: SLOTS_PORT,
      user: SLOTS_USERNAME,
      password: await this.rds.getConnectionToken(),
      database: 'slots',
      ssl: 'Amazon RDS',
      authPlugins: {
        mysql_clear_password: () => () => this.rds.getConnectionToken(),
      },
    };
  }
}
