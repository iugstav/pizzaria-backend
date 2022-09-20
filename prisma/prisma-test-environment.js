const { randomUUID } = require("crypto");
const { exec } = require('child_process');
const NodeEnvironment = require('jest-environment-node').default;
const { Client } = require("pg");
const util = require('util');

require("dotenv-flow").config({ node_env: 'test', silent: true });

const execSync = util.promisify(exec);

const prismaBinary = './node_modules/.bin/prisma';

class PrismaTestEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);

    const user = process.env.DATABASE_USER;
    const password = process.env.DATABASE_PASSWORD;
    const databaseName = process.env.DATABASE_NAME;
    const host = process.env.DATABASE_HOST;
    const port = process.env.DATABASE_PORT;

    this.schema = `test_${randomUUID()}`;
    this.connectionString = `postgresql://${user}:${password}@${host}:${port}/${databaseName}?schema=${this.schema}`;
  }

  async setup() {
    process.env.DATABASE_URL = this.connectionString;
    this.global.process.env.DATABASE_URL = this.connectionString;

    // Rodar as migrations
    await execSync(`${prismaBinary} migrate deploy --preview-feature`);

    return super.setup();
  }

  async teardown() {
    const client = new Client({
      connectionString: this.connectionString
    });

    await client.connect();
    await client.query(`DROP SCHEMA IF EXISTS "${this.schema}" CASCADE`);
    await client.end();

    return super.teardown();
  }
}

module.exports = PrismaTestEnvironment;

