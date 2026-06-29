import { getAllToolDefinitions } from '../services/toolMergeService.js';

export const getToolDefinitions = async (req, res) => {
    try {
        const toolDefinitions = await getAllToolDefinitions();
        return res.status(200).json({
            success: true,
            data: toolDefinitions,
        });
    } catch (error) {
        console.error('Tool Definitions Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message,
        });
    }
};
