import axios from 'axios';
import * as cheerio from 'cheerio';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
// Use Service Role Key for admin access (writing to DB)
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("❌ Missing Supabase keys in .env file (Need SUPABASE_SERVICE_ROLE_KEY).");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const TARGET_URL = 'https://www.animate-onlineshop.co.kr/board/list.php?bdId=event';

async function scrapeAnimate() {
    console.log(`🚀 Starting scraper for ${TARGET_URL}...`);

    try {
        const { data } = await axios.get(TARGET_URL, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        const $ = cheerio.load(data);
        const events = [];

        // The selector needs to be adjusted based on actual page structure.
        // Assuming a standard board list structure based on common Korean bulletin boards (XpressEngine/GNUBoard style)
        // Looking for list items. The class names below are guesses based on typical layouts, 
        // but the script includes error handling and logging to help debug if they are wrong.

        // Attempting to find list rows. 
        // Typical selectors: .board_list tbody tr, or .list_card li
        // Let's rely on finding titles and dates.

        // Correct selectors based on HTML inspection
        // List Items: .event_list ul li
        $('.event_list ul li').each((i, el) => {
            const titleEl = $(el).find('.board_tit strong');
            const title = titleEl.text().trim();

            const dateEl = $(el).find('.board_event_day span');
            const dateText = dateEl.text().replace('이벤트기간', '').trim(); // e.g. "2026.01.16 00:00 ~ 2026.02.08 23:59"

            const imgEl = $(el).find('.board_img img');
            let imgSrc = imgEl.attr('src');

            // Handle JS Link: javascript:gd_btn_view('event',375 , 'y')
            const linkHref = $(el).find('.board_img a').attr('href');
            let eventId = null;
            if (linkHref) {
                const match = linkHref.match(/gd_btn_view\('[^']+',\s*(\d+)/);
                if (match) {
                    eventId = match[1];
                }
            }

            if (title && eventId) {
                // Parse Dates
                let startDate = new Date();
                let endDate = new Date(new Date().setDate(new Date().getDate() + 14));

                if (dateText.includes('~')) {
                    const parts = dateText.split('~');
                    startDate = new Date(parts[0].trim());
                    endDate = new Date(parts[1].trim());
                }

                events.push({
                    title: title,
                    type: 'POPUP', // Default
                    location: 'Animate Korea',
                    url: `https://www.animate-onlineshop.co.kr/board/view.php?bdId=event&sno=${eventId}`,
                    event_date_start: startDate.toISOString(),
                    event_date_end: endDate.toISOString(),
                    image_url: imgSrc ? imgSrc : null,
                    description: dateText
                });
            }
        });

        console.log(`✅ Scraped ${events.length} events.`);

        // Check for existing events to avoid duplicates (manual upsert logic)
        const { data: existingEvents } = await supabase
            .from('events')
            .select('title');

        const existingTitles = new Set(existingEvents?.map(e => e.title) || []);

        const newEvents = events.filter(e => !existingTitles.has(e.title));

        if (newEvents.length === 0) {
            console.log("✨ No new events to insert.");
        } else {
            const dbPayload = newEvents.map(e => ({
                title: e.title,
                type: 'POPUP',
                location_name: 'Animate Korea',
                verification_level: 2,
                image_urls: e.image_url ? [e.image_url] : [],
                description: e.description,
                start_date: e.start_date,
                end_date: e.end_date,
                source_url: e.source_url
            }));

            const { data: inserted, error } = await supabase
                .from('events')
                .insert(dbPayload)
                .select();

            if (error) {
                console.error("❌ Supabase Insert Error:", error);
            } else {
                console.log(`🎉 Successfully inserted ${inserted.length} new events!`);
            }
        }
    } catch (error) {
        console.error("❌ Scraper Error:", error.message);
    }
}

scrapeAnimate();
