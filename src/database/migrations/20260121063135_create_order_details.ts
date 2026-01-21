import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("order_details", (table) => {
        table.increments("order_detail_id").primary();
        table.integer("order_id").notNullable().references("order_id").inTable("orders").onDelete("CASCADE");
        table.integer("product_id").notNullable().references("product_id").inTable("products").onDelete("CASCADE");
        table.decimal("unit_price", 10, 2).notNullable();
        table.integer("quantity").notNullable();
        table.decimal("discount", 10, 2).nullable();
    });
}


export async function down(knex: Knex): Promise<void> {
}

