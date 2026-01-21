import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("categories", (table) => {
        table.increments("category_id").primary();
        table.string("category_name").notNullable();
        table.text("description").nullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("categories");
}

