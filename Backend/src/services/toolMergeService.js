import ToolDefinition from '../models/ToolDefinition.js';
import UserToolPreference from '../models/UserToolPreference.js';
import { deepMerge } from '../utils/deepMergeTool.js';

let cachedToolDefinitions = null;

export const loadToolDefinitions = async () => {
    if (cachedToolDefinitions) {
        return cachedToolDefinitions;
    }

    const toolDefinitions = await ToolDefinition.find({}).sort({ order: 1 }).lean();
    cachedToolDefinitions = toolDefinitions;
    return toolDefinitions;
};

export const getMergedToolsetForUser = async (userId) => {
    const toolDefinitions = await loadToolDefinitions();
    const userPreference = await UserToolPreference.findOne({ userId }).lean();

    return toolDefinitions
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
};

export const getAllToolDefinitions = async () => {
    return await loadToolDefinitions();
};

export const clearToolDefinitionCache = () => {
    cachedToolDefinitions = null;
};
