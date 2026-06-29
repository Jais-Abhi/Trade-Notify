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

        const count = await ToolDefinition.countDocuments();
        if (count === 0) {
            await ToolDefinition.create({
                tool: 'trendline',
                displayName: 'Trend Line',
                category: 'Lines',
                icon: 'trend-line',
                order: 1,
                enabled: true,
                style: {
                    color: '#3b82f6',
                    width: 2,
                    lineStyle: 'solid'
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
            });
            console.log('Seeded ToolDefinition: trendline');
        } else {
            console.log('ToolDefinition collection already seeded');
        }

        process.exit(0);
    } catch (error) {
        console.error('Seed Error:', error);
        process.exit(1);
    }
};

seedToolDefinitions();
