import stocks from "../config/stocks.json" with { type: "json" };

// @desc    Get all stocks
// @route   GET /api/stocks
export const getAllStocks = (req, res) => {
    const limit = parseInt(req.query.limit) || stocks.length;
    const result = stocks.slice(0, limit);

    res.status(200).json({
        success: true,
        count: result.length,
        data: result
    });
};

// @desc    Search stocks by symbol or name
// @route   GET /api/stocks/search
export const searchStocks = (req, res) => {
    const query = req.query.q?.toLowerCase();
    const limit = parseInt(req.query.limit) || 100; // limit search results by default

    if (!query) {
        return res.status(400).json({
            success: false,
            message: "Query is required"
        });
    }

    const filtered = stocks.filter(stock =>
        stock.name.toLowerCase().includes(query) ||
        stock.symbol.toLowerCase().includes(query)
    );

    const result = filtered.slice(0, limit);

    res.status(200).json({
        success: true,
        count: result.length,
        data: result
    });
};
