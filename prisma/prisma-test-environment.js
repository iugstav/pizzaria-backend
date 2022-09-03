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

    // Rodar as migrations
    execSync(`${prismaBinary} migrate deploy --preview-feature`);
  }

  async teardown() {


    await super.teardown();
  }
}

module.exports = PrismaTestEnvironment

