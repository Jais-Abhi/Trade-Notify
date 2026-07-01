import trendline from '../groups/lines/trendline/trendline.tool.js';
import pricerange from '../groups/measures/pricerange/pricerange.tool.js';

const IMPLEMENTATIONS = {
    trendline,
    pricerange,
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
    const groups = {
        lines: {
            key: 'lines',
            title: 'Lines',
            tools: [trendline.META],
        },
        measures: {
            key: 'measures',
            title: 'Measures',
            tools: [pricerange.META],
        },
    };

    return Object.values(groups);
};

export default {
    getToolImplementation,
    getToolRenderer,
    getRegistryMetadata,
};
