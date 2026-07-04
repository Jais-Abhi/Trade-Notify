import cron from 'node-cron';
import { findBaseCandleGroup } from '../services/ftf/baseCandleScanner.js';

export const startFTFScannerCron = () => {
    console.log('======================================');
    console.log('FTF Scanner Cron Started');
    console.log('Schedule :');
    console.log('Every 5 Minutes');
    console.log('Delay :');
    console.log('2 Minutes');
    console.log('======================================');

    cron.schedule('2-59/5 * * * *', async () => {
        console.log('======================================');
        console.log('FTF Scanner Triggered');
        console.log('Current Time (IST):');
        console.log(new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));
        console.log('======================================');

        try {
            await findBaseCandleGroup();
        } catch (error) {
            console.log('======================================');
            console.log('FTF Scanner Error');
            console.log(error);
            console.log('======================================');
        }
    });
};
