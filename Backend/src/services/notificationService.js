import { getTelegramUpdates, sendTelegramMessage } from './telegramService.js';

const toIST = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
};

const formatCandle = (candle, label) => {
    if (!candle) return '';

    return [
        `${label}`,
        `Time: ${toIST(candle.time)}`,
        `O: ${candle.open}`,
        `H: ${candle.high}`,
        `L: ${candle.low}`,
        `C: ${candle.close}`,
        ''
    ].join('\n');
};

const buildBaseCandleNotificationMessage = ({ symbol, interval, baseCandleGroup, detectedAt }) => {
    const baseCandles = Array.isArray(baseCandleGroup?.baseCandles) ? baseCandleGroup.baseCandles : [];
    const legIn = baseCandleGroup?.legIn;
    const legOut = baseCandleGroup?.legOut;

    const sections = [
        '🚨🚨🚨 TradeNotify Alert',
        '',
        'New Zone Detected',
        '',
        `Symbol: ${symbol || 'N/A'}`,
        '',
        `Interval: ${interval || 'N/A'}`,
        '',
        'Base Candle Range',
        '',
        `Start: ${toIST(baseCandleGroup?.baseStartTime || detectedAt || baseCandleGroup?.baseEndTime || Date.now() / 1000)}`,
        `End: ${toIST(baseCandleGroup?.baseEndTime || baseCandleGroup?.baseStartTime || detectedAt || Date.now() / 1000)}`,
        '',
        `Base Candles - ${baseCandles.length} Candles `,
        '',
        'Leg-In',
        '',
        formatCandle(legIn, 'Time:'),
        'Base Candle(s)',
        ''
    ];

    baseCandles.forEach((candle, index) => {
        sections.push(`Base Candle #${index + 1}`);
        sections.push('');
        sections.push(...formatCandle(candle, 'Time:').split('\n'));
        sections.push('');
    });

    sections.push('Leg-Out');
    sections.push('');
    sections.push(...formatCandle(legOut, 'Time:').split('\n'));
    sections.push('');
    sections.push('Follow The Footprint Strategy');
    sections.push('');
    sections.push('TradeNotify');

    return sections.join('\n');
};

const notifyNewBaseCandleGroup = async ({ symbol, interval, baseCandleGroup }) => {
    // console.log('[Notification] New Base Candle Group saved.');

    try {
        const updates = await getTelegramUpdates();
        const uniqueChatIds = [...new Set(
            updates
                .map((update) => update?.message?.chat?.id || update?.callback_query?.message?.chat?.id)
                .filter(Boolean)
        )];

        // console.log(`[Telegram] Found ${uniqueChatIds.length} Telegram users.`);
        // console.log('[Telegram] Sending notifications...');

        const message = buildBaseCandleNotificationMessage({
            symbol,
            interval,
            baseCandleGroup,
            detectedAt: baseCandleGroup?.detectedAt ? Math.floor(new Date(baseCandleGroup.detectedAt).getTime() / 1000) : undefined
        });

        for (const chatId of uniqueChatIds) {
            try {
                await sendTelegramMessage(chatId, message);
                console.log(`[Telegram] Successfully sent to Chat ID: ${chatId}`);
            } catch (error) {
                console.error(`[Telegram] Failed for Chat ID: ${chatId}`);
                console.error(error);
            }
        }

        console.log('[Telegram] Completed.');
        return { success: true, chatCount: uniqueChatIds.length };
    } catch (error) {
        console.error('[Telegram] Notification flow failed');
        console.error(error);
        return { success: false, chatCount: 0 };
    }
};

export { notifyNewBaseCandleGroup };
export default {
    notifyNewBaseCandleGroup
};
