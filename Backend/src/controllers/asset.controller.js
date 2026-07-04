import stocks from '../config/stocks.json' with { type: 'json' };
import crypto from '../config/crypto.json' with { type: 'json' };
import forex from '../config/forex.json' with { type: 'json' };

const datasets = {
    stocks,
    crypto,
    forex
};

const createAssetHandlers = (datasetKey) => {
    const dataSource = datasets[datasetKey] || [];

    return {
        getAllAssets: (req, res) => {
            const limit = parseInt(req.query.limit) || dataSource.length;
            const result = dataSource.slice(0, limit);

            res.status(200).json({
                success: true,
                count: result.length,
                data: result
            });
        },

        searchAssets: (req, res) => {
            const query = req.query.q?.toLowerCase();
            const limit = parseInt(req.query.limit) || 100;

            if (!query) {
                return res.status(400).json({
                    success: false,
                    message: 'Query is required'
                });
            }

            const filtered = dataSource.filter(asset =>
                (asset.name || '').toLowerCase().includes(query) ||
                (asset.symbol || '').toLowerCase().includes(query)
            );

            const result = filtered.slice(0, limit);

            res.status(200).json({
                success: true,
                count: result.length,
                data: result
            });
        }
    };
};

export const stockAssetHandlers = createAssetHandlers('stocks');
export const cryptoAssetHandlers = createAssetHandlers('crypto');
export const forexAssetHandlers = createAssetHandlers('forex');
