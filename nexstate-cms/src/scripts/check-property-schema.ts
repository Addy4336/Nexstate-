
import { supabaseAdmin } from "../lib/db";

async function main() {
    console.log("Connecting to database...");
    try {
        // Using Supabase to query the information_schema
        const { data, error } = await supabaseAdmin.rpc('get_property_columns');

        if (error) {
            // Fallback: Just log that this script is deprecated
            console.log("Note: This script uses deprecated direct SQL queries.");
            console.log("Property table schema check is not available via Supabase client.");
            console.log("Use the Supabase dashboard to inspect table schemas.");
            return;
        }

        console.log("Property table columns:", data);
    } catch (err) {
        console.error("Error querying table:", err);
        console.log("Note: Direct SQL queries are not supported. Use Supabase dashboard.");
    }
}

main();
