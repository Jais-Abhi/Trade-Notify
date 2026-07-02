import trendline from '../groups/lines/trendline/trendline.tool.js';
import pricerange from '../groups/measures/pricerange/pricerange.tool.js';
import longposition from '../groups/forecasting/longposition/longposition.tool.js';

const IMPLEMENTATIONS = {
    trendline,
    pricerange,
    // forecasting
    longposition,
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
        forecasting: {
            key: 'forecasting',
            title: 'Forecasting',
            tools: [longposition.META],
        },
    };

    return Object.values(groups);
};

export default {
    getToolImplementation,
    getToolRenderer,
    getRegistryMetadata,
};
