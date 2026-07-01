import registry from '../tools/registry/registry.js';

export const getToolRenderer = (tool = 'trendline') => registry.getToolRenderer(tool);

export default {
    getToolRenderer,
};
