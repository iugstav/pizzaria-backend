const { randomUUID } = require("crypto")
const { exec } = require('child_process')
const NodeEnvironment = require('jest-environment-node').default
const { Client } = require("pg")
const util = require('util')

require("dotenv-flow").config({ node_env: 'test', silent: true });

const execSync = util.promisify(exec);

const prismaBinary = './node_modules/.bin/prisma'

class PrismaTestEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);

    this.schema = `test_${randomUUID()}`
    this.connectionString = process.env.DATABASE_URL;
  }

  async setup() {
    process.env.DATABASE_URL = this.connectionString
    this.global.process.env.DATABASE_URL = this.connectionString

    // Rodar as migrations
    await execSync(`${prismaBinary} migrate deploy --preview-feature`);

    return super.setup();
  }

  async teardown() {
    const client = new Client({
      connectionString: this.connectionString
    })

    await client.connect()
    await client.query(`DROP SCHEMA IF EXISTS "${this.schema}" CASCADE`)
    await client.end()

  }
}

module.exports = PrismaTestEnvironment

