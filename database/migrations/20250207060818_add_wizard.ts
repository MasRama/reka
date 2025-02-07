import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('wizard_sessions', (table) => {
    table.bigInteger('user_id').primary().notNullable();
    table.integer('step').notNullable().defaultTo(0);
    table.jsonb('data').notNullable().defaultTo('{}');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    
    table.comment('Stores wizard session data for user conversations');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('wizard_sessions');
}

