import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("products", (table) => {
        table.increments("product_id").primary();
        table.string("product_name").notNullable();
        table.integer("category_id").notNullable().references("category_id").inTable("categories").onDelete("CASCADE");
        table.decimal("unit_price", 10, 2).notNullable();
        table.integer("units_in_stock").notNullable();
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("products");
}

