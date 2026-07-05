import cron from 'node-cron';
import { findBaseCandleGroup } from '../services/ftf/baseCandleScanner.js';

export const startFTFScannerCron = () => {
    console.log('======================================');
    console.log('FTF Scanner Cron Started');
    console.log('Every 15 Minutes');
    console.log('2 Minutes  Delay');
    console.log('======================================');

    cron.schedule('2-59/15 * * * *', async () => {
        console.log("Scanner Triggered",new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));
        console.log('======================================');

        try {
            await findBaseCandleGroup();
            console.log("FTF Scanner Completed");

        } catch (error) {
            console.log('======================================');
            console.log('FTF Scanner Error');
            console.log(error);
            console.log('======================================');
        }
    },{
        scheduled: true,
        timezone: "Asia/Kolkata"
  });
};
