const { exec } = require('child_process')
const NodeEnvironment = require('jest-environment-node').default
const mysql = require("mysql2")
const util = require('util')

require("dotenv-flow").config({ node_env: 'test', silent: true });

const execSync = util.promisify(exec);

const prismaBinary = './node_modules/.bin/prisma'

class PrismaTestEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);

    this.connectionString = process.env.DATABASE_URL;
  }

  async setup() {
    process.env.DATABASE_URL = this.connectionString
    this.global.process.env.DATABASE_URL = this.connectionString

    // Rodar as migrations
    execSync(`${prismaBinary} migrate deploy --preview-feature`);

    return super.setup();
  }

  async teardown() {
    const client = mysql.createConnection({
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME
    })

    client.connect();
    client.query(`DROP DATABASE IF EXISTS ${process.env.DATABASE_NAME}`);
    client.query(`CREATE DATABASE ${process.env.DATABASE_NAME}`);
    client.end()

    await super.teardown();
  }
}

module.exports = PrismaTestEnvironment

