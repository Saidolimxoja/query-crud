import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    await knex("customers").del();
    await knex("customers").insert([
        { customer_id: 1, company_name: "Company A", contact_name: "Akrom", contact_title: "Manager", address: "Yunusabad district 9", city: "TASHKENT ", region: "TASH", postal_code: "100010", country: "UZBEKISTAN", phone: "+998-123456789" },
        { customer_id: 2, company_name: "Company B", contact_name: "Shavkat", contact_title: "Director", address: "Karvan Bazar", city: "BUXARA", region: "BUX", postal_code: "100000", country: "UZBEKISTAN", phone: "+998-987654321" },
        { customer_id: 3, company_name: "Company C", contact_name: "Aziza", contact_title: "President", address: "LOLA Jahon bozor", city: "NAMANGAN", region: "NAM", postal_code: "100190", country: "UZBEKISTAN", phone: "+998-555555555" }
    ]);
}