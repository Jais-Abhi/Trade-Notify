import registry from '../tools/registry';

export const getToolRenderer = (tool = 'trendline') => registry.getToolRenderer(tool);

export default {
    getToolRenderer,
};
