import axios from 'axios';
import * as cheerio from 'cheerio';
import Tesseract from 'tesseract.js';
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

console.log(`Debug: VITE_SUPABASE_URL exists? ${!!SUPABASE_URL}`);
console.log(`Debug: SUPABASE_SERVICE_ROLE_KEY exists? ${!!SUPABASE_KEY}`);
if (SUPABASE_KEY) {
    console.log(`Debug: Key length: ${SUPABASE_KEY.length}`);
    console.log(`Debug: Key starts with: ${SUPABASE_KEY.substring(0, 5)}...`);
}

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

        // Use a for...of loop to handle async operations properly
        for (let i = 0; i < 15; i++) { // Increase limit to 15 to cover more past events
            const el = $('.event_list ul li').eq(i);
            const titleEl = $(el).find('.board_tit strong');
            const title = titleEl.text().trim();

            const dateEl = $(el).find('.board_event_day span');
            const dateText = dateEl.text().replace('이벤트기간', '').trim();

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

                // --- ADVANCED: Fetch Detail Page & OCR ---
                const detailUrl = `https://www.animate-onlineshop.co.kr/board/view.php?bdId=event&sno=${eventId}`;

                // Initialize description with structured Markdown
                let description = `## 📅 기간 (Period)\n${dateText}\n\n`;
                let detailImages = [];

                try {
                    console.log(`verify: Fetching detail for ${title}...`);
                    const { data: detailHtml } = await axios.get(detailUrl, {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                        }
                    });
                    const $detail = cheerio.load(detailHtml);

                    // Extract text from the view content
                    // Common selectors: .view_cont, .goods_view_cont
                    const contentContainer = $detail('.view_cont').length ? $detail('.view_cont') : $detail('.board_view_content');

                    // Pre-process: Replace <br> with newlines to preserve formatting
                    contentContainer.find('br').replaceWith('\n');
                    contentContainer.find('p').after('\n\n'); // Separate paragraphs

                    const contentText = contentContainer.text().trim();

                    if (contentText) {
                        description += `## 📝 상세 내용 (Details)\n${contentText}\n\n`;
                    }

                    // Extract all images in detail page
                    $detail('.view_cont img, .board_view_content img').each((_, img) => {
                        const src = $detail(img).attr('src');
                        if (src) detailImages.push(src);
                    });

                    // OCR on the Main Image (imgSrc) -> ONLY if content is short/missing
                    if (imgSrc && (!contentText || contentText.length < 50)) {
                        console.log(`   Performing OCR on image...`);
                        try {
                            const { data: { text: ocrText } } = await Tesseract.recognize(imgSrc, 'kor');
                            // Clean up OCR text slightly
                            const cleanOcr = ocrText.split('\n').filter(line => line.trim().length > 0).join('\n');
                            description += `## 🤖 AI 분석 (Image Analysis)\n> 이미지에서 텍스트를 자동 추출했습니다.\n\n\`\`\`\n${cleanOcr}\n\`\`\``;
                        } catch (ocrErr) {
                            console.warn("   OCR Failed:", ocrErr.message);
                        }
                    }

                } catch (err) {
                    console.error(`   Failed to fetch details: ${err.message}`);
                }

                events.push({
                    title: title,
                    type: 'POPUP', // Default
                    location: 'Animate Korea',
                    source_url: detailUrl, // Use detail URL as source
                    start_date: startDate.toISOString(),
                    end_date: endDate.toISOString(),
                    image_url: imgSrc ? imgSrc : null,
                    image_urls: detailImages.length > 0 ? detailImages : (imgSrc ? [imgSrc] : []),
                    description: description
                });
            }
        }

        console.log(`✅ Scraped ${events.length} events.`);

        console.log(`✅ Scraped ${events.length} events. syncing with database...`);

        for (const event of events) {
            // Check if exists
            const { data: existing } = await supabase
                .from('events')
                .select('id')
                .eq('title', event.title)
                .maybeSingle();

            const payload = {
                title: event.title,
                type: 'POPUP',
                location_name: 'Animate Korea',
                verification_level: 2,
                image_urls: event.image_urls,
                description: event.description,
                start_date: event.start_date,
                end_date: event.end_date,
                source_url: event.source_url
            };

            if (existing) {
                console.log(`   🔄 Updating existing event: ${event.title}`);
                await supabase
                    .from('events')
                    .update(payload)
                    .eq('id', existing.id);
            } else {
                console.log(`   ✨ Inserting new event: ${event.title}`);
                await supabase
                    .from('events')
                    .insert(payload);
            }
        }
        console.log("🎉 Database sync complete!");

    } catch (error) {
        console.error("❌ Scraper Error:", error.message);
    }
}

scrapeAnimate();
