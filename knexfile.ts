
require('dotenv').config()

import type { Knex } from "knex";
import knex from "./services/db";

// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
 

  development: {
    client: "better-sqlite3",
    connection: {
      filename: "./devdb.sqlite3"
    },
    useNullAsDefault : true,
    seeds: {
      directory: "./database/seeds"
    },
    migrations: {
      directory: "./database/migrations"
    }
  },

  production: {
    client: "better-sqlite3",
    connection: {
      filename: "./prodb.sqlite3"
    },
    useNullAsDefault : true,
    seeds: {
      directory: "./database/seeds"
    },
    migrations: {
      directory: "./database/migrations"
    }
  },

};

export default config
