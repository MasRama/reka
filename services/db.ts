import config from '../knexfile';
import { Knex } from 'knex';

require('dotenv').config()
const dbInstance: { [key: string]: Knex } = {};

const DB_CONNECTION = process.env.NODE_ENV || 'development';
let DB = require('knex')(config[DB_CONNECTION]);

DB.connection = (stage: string): Knex => { 
    if(dbInstance[stage]) {
        return dbInstance[stage];
    } else {
        dbInstance[stage] = DB = require('knex')(config[stage]);
        return dbInstance[stage];
    }
}

export default DB;