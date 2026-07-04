import axios from 'axios';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API_BASE_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

const getTelegramUpdates = async () => {
    try {
        console.log('[Telegram] Fetching updates...');

        const response = await axios.get(`${TELEGRAM_API_BASE_URL}/getUpdates`);

        if (!response.data || !response.data.ok) {
            throw new Error(response.data?.description || 'Telegram getUpdates failed');
        }

        console.log(`[Telegram] Total updates: ${response.data.result?.length || 0}`);
        return response.data.result || [];
    } catch (error) {
        console.error('[Telegram] Failed to fetch updates');
        console.error(error?.response?.data || error.message || error);
        throw error;
    }
};

const sendTelegramMessage = async (chatId, message) => {
    try {
        console.log(`[Telegram] Sending message to Chat ID: ${chatId}`);

        const response = await axios.post(`${TELEGRAM_API_BASE_URL}/sendMessage`, {
            chat_id: chatId,
            text: message,
            parse_mode: 'Markdown'
        });

        if (!response.data || !response.data.ok) {
            throw new Error(response.data?.description || 'Telegram sendMessage failed');
        }

        console.log('[Telegram] Message sent successfully.');
        return response.data;
    } catch (error) {
        console.error(`[Telegram] Failed to send message to Chat ID: ${chatId}`);
        console.error(error?.response?.data || error.message || error);
        throw error;
    }
};

export { getTelegramUpdates, sendTelegramMessage };
export default {
    getTelegramUpdates,
    sendTelegramMessage
};
