import ToolDefinition from './models/ToolDefinition.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });
import connectDB from './config/db.js';

const seedToolDefinitions = async () => {
    try {
        await connectDB();

        const toolDefinitions = [
            {
                tool: 'trendline',
                displayName: 'Trend Line',
                category: 'Lines',
                icon: 'trend-line',
                order: 1,
                enabled: true,
                style: {
                    color: '#3b82f6',
                    width: 2,
                    lineStyle: 'solid',
                    fillOpacity: 0.16
                },
                options: {
                    extendLeft: false,
                    extendRight: false
                },
                supports: {
                    color: true,
                    width: true,
                    lineStyle: true,
                    opacity: true
                }
            },
            {
                tool: 'pricerange',
                displayName: 'Price Range',
                category: 'Measures',
                icon: 'price-range',
                order: 2,
                enabled: true,
                style: {
                    color: '#f59e0b',
                    width: 2,
                    lineStyle: 'solid',
                    fillOpacity: 0.16
                },
                options: {
                    showLabel: true
                },
                supports: {
                    color: true,
                    width: true,
                    lineStyle: true,
                    opacity: true,
                    fillOpacity: true
                }
            },
            {
    tool: 'longposition',
    displayName: 'Long Position',
    category: 'Forecasting',
    icon: 'long-position',
    order: 3,
    enabled: true,
    style: {
        profitColor: '#22c55e',
        lossColor: '#ef4444',
        entryColor: '#3b82f6',
        borderColor: '#9ca3af',
        width: 2,
        lineStyle: 'solid',
        fillOpacity: 0.25
    },
    options: {
        defaultRiskReward: 1,
        defaultWidth: 80,
        showLabels: true,
        lockRiskReward: false
    },
    supports: {
        profitColor: true,
        lossColor: true,
        entryColor: true,
        borderColor: true,
        width: true,
        lineStyle: true,
        fillOpacity: true,
        labels: true
    }
}
        ];

        for (const toolDefinition of toolDefinitions) {
            await ToolDefinition.updateOne(
                { tool: toolDefinition.tool },
                { $set: toolDefinition },
                { upsert: true }
            );
        }

        console.log('Seeded/updated tool definitions');

        process.exit(0);
    } catch (error) {
        console.error('Seed Error:', error);
        process.exit(1);
    }
};

seedToolDefinitions();
