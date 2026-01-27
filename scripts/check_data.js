import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkData() {
    const { data, error } = await supabase
        .from('events')
        .select('title, description')
        .limit(1);

    if (error) console.error(error);
    else {
        console.log("--- DB Record ---");
        console.log("Title:", data[0]?.title);
        console.log("Description Preview:", data[0]?.description?.substring(0, 200));
        console.log("-----------------");
    }
}

checkData();
