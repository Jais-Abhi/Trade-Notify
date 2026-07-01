import trendline from '../groups/lines/trendline';

const IMPLEMENTATIONS = {
    trendline,
};

export const getToolImplementation = (tool) => IMPLEMENTATIONS[tool] || IMPLEMENTATIONS.trendline;

export const getToolRenderer = (tool) => {
    const impl = getToolImplementation(tool);
    // each implementation exposes render and hitTest
    return {
        render: impl.render,
        hitTest: impl.hitTest,
    };
};

export default {
    getToolImplementation,
    getToolRenderer,
};
