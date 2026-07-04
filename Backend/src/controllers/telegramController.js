import { getTelegramUpdates, sendTelegramMessage } from '../services/telegramService.js';

const TEST_MESSAGE = `✅ TradeNotify

Telegram integration is working successfully.

Thank you for connecting with TradeNotify!`;

export const sendTestMessage = async (req, res) => {
    try {
        const updates = await getTelegramUpdates();

        const uniqueChatIds = [...new Set(
            updates
                .map((update) => update?.message?.chat?.id || update?.callback_query?.message?.chat?.id)
                .filter(Boolean)
        )];

        console.log(`[Telegram] Unique users found: ${uniqueChatIds.length}`);

        let successfulMessages = 0;
        let failedMessages = 0;

        for (const chatId of uniqueChatIds) {
            try {
                await sendTelegramMessage(chatId, TEST_MESSAGE);
                successfulMessages += 1;
            } catch (error) {
                failedMessages += 1;
            }
        }

        console.log('[Telegram] Completed.');

        return res.status(200).json({
            success: true,
            totalUpdates: updates.length,
            totalUniqueChatIds: uniqueChatIds.length,
            totalSuccessfulMessages: successfulMessages,
            totalFailedMessages: failedMessages
        });
    } catch (error) {
        console.error('[Telegram] Controller failed');
        console.error(error);

        return res.status(500).json({
            success: false,
            message: 'Telegram test message flow failed',
            error: error.message || 'Unknown error'
        });
    }
};

export default {
    sendTestMessage
};
