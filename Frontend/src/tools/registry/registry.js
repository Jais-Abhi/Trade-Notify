import trendline from '../groups/lines/trendline/trendline.tool.js';

const IMPLEMENTATIONS = {
    trendline,
};

export const getToolImplementation = (toolId) => IMPLEMENTATIONS[toolId] || IMPLEMENTATIONS.trendline;

export const getToolRenderer = (toolId) => {
    const impl = getToolImplementation(toolId);
    return {
        render: impl.render,
        hitTest: impl.hitTest,
    };
};

export const getRegistryMetadata = () => {
    // Build grouped metadata for toolbar consumption
    const groups = {
        lines: {
            key: 'lines',
            title: 'Lines',
            tools: [trendline.META || trendline.UI?.META || { tool: 'trendline', displayName: 'Trend Line', icon: 'trendline' }],
        },
    };

    return Object.values(groups);
};

export default {
    getToolImplementation,
    getToolRenderer,
    getRegistryMetadata,
};
