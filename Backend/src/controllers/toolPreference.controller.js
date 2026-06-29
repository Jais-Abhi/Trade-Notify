import UserToolPreference from '../models/UserToolPreference.js';
import ToolDefinition from '../models/ToolDefinition.js';
import { deepMerge } from '../utils/deepMergeTool.js';

export const getMergedTools = async (req, res) => {
    try {
        const userId = req.user._id;
        const toolDefinitions = await ToolDefinition.find({}).sort({ order: 1 }).lean();
        const userPreference = await UserToolPreference.findOne({ userId }).lean();

        const mergedTools = toolDefinitions
            .filter(tool => tool.enabled !== false)
            .map((toolDefinition) => {
                const userToolOverride = userPreference?.tools?.find((item) => item.tool === toolDefinition.tool);

                return {
                    ...toolDefinition,
                    style: deepMerge(toolDefinition.style || {}, userToolOverride?.style || {}),
                    options: deepMerge(toolDefinition.options || {}, userToolOverride?.options || {}),
                    supports: deepMerge(toolDefinition.supports || {}, userToolOverride?.supports || {}),
                };
            });

        return res.status(200).json({
            success: true,
            data: mergedTools,
        });
    } catch (error) {
        console.error('Get Merged Tools Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message,
        });
    }
};

export const patchToolPreference = async (req, res) => {
    try {
        const userId = req.user._id;
        const { toolId } = req.params;
        const { style, options } = req.body;

        if (!toolId) {
            return res.status(400).json({ success: false, message: 'Tool ID is required' });
        }

        const toolDefinition = await ToolDefinition.findOne({ tool: toolId }).lean();
        if (!toolDefinition) {
            return res.status(404).json({ success: false, message: 'Tool definition not found' });
        }

        let userPreference = await UserToolPreference.findOne({ userId });
        if (!userPreference) {
            userPreference = new UserToolPreference({ userId, tools: [] });
        }

        const existingToolIndex = userPreference.tools.findIndex((item) => item.tool === toolId);

        const newToolOverride = {
            tool: toolId,
            style: style && typeof style === 'object' ? style : {},
            options: options && typeof options === 'object' ? options : {},
        };

        if (existingToolIndex >= 0) {
            const existingOverride = userPreference.tools[existingToolIndex];
            existingOverride.style = deepMerge(existingOverride.style || {}, newToolOverride.style);
            existingOverride.options = deepMerge(existingOverride.options || {}, newToolOverride.options);
            userPreference.tools[existingToolIndex] = existingOverride;
        } else {
            userPreference.tools.push(newToolOverride);
        }

        await userPreference.save();

        const mergedStyle = deepMerge(toolDefinition.style || {}, userPreference.tools.find((item) => item.tool === toolId)?.style || {});
        const mergedOptions = deepMerge(toolDefinition.options || {}, userPreference.tools.find((item) => item.tool === toolId)?.options || {});

        return res.status(200).json({
            success: true,
            data: {
                tool: toolId,
                style: mergedStyle,
                options: mergedOptions,
            },
        });
    } catch (error) {
        console.error('Patch Tool Preference Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message,
        });
    }
};
