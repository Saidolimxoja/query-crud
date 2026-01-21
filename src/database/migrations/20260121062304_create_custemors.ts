import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("customers", (table) => {
        table.increments("customer_id").primary();
        table.string("email").notNullable().unique();
        table.string("password_hash").notNullable();
        table.string("first_name").notNullable();
        table.string("last_name").notNullable();
        table.string("phone_number").nullable();
        table.string("address").nullable();
        table.string("city").nullable();
        table.string("postal_code").nullable();
        table.string("country").nullable();
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("customers");
}

