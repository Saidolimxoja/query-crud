import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("orders", (table) => {
        table.increments("order_id").primary();
        table.integer("customer_id").notNullable().references("customer_id").inTable("customers").onDelete("CASCADE");
        table.date("order_date").notNullable();
        table.date("required_date").notNullable();
        table.date("shipped_date").nullable();
        table.decimal("freight", 10, 2).nullable();
        table.string("ship_name").nullable();
        table.string("ship_address").nullable();
        table.string("ship_city").nullable();
        table.string("ship_country").nullable();
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("orders");
}

