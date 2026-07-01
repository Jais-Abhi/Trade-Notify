import trendline from '../groups/lines/trendline/trendline.tool.js';

const IMPLEMENTATIONS = {
    trendline,
};

export const getToolImplementation = (tool) => IMPLEMENTATIONS[tool] || IMPLEMENTATIONS.trendline;

export const getToolRenderer = (tool) => {
    const impl = getToolImplementation(tool);
    return {
        render: impl.render,
        hitTest: impl.hitTest,
    };
};

export default {
    getToolImplementation,
    getToolRenderer,
};
