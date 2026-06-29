import ChartDrawing from '../models/ChartDrawing.js';

/**
 * @desc    Save/Update drawings for a specific chart (user + symbol, shared across all intervals)
 * @route   POST /api/chart-drawings/save
 * @access  Private
 */
export const saveDrawings = async (req, res) => {
    try {
        const { symbol, drawings } = req.body;
        console.log(symbol,drawings);
        const userId = req.user._id;

        // Validation
        if (!symbol) {
            return res.status(400).json({
                success: false,
                message: 'Symbol is required'
            });
        }

        if (!Array.isArray(drawings)) {
            return res.status(400).json({
                success: false,
                message: 'Drawings must be an array'
            });
        }

        // Validate each drawing item structure basic requirements
        for (const item of drawings) {
            if (!item.id || !item.tool || !Array.isArray(item.points)) {
                return res.status(400).json({
                    success: false,
                    message: 'Each drawing must contain a valid id, tool, and points array'
                });
            }
        }

        // Find and update or create new document (keyed by userId + symbol only)
        const drawingDoc = await ChartDrawing.findOneAndUpdate(
            { userId, symbol },
            { drawings },
            { new: true, upsert: true, runValidators: true }
        );

        return res.status(200).json({
            success: true,
            message: 'Drawings saved successfully',
            data: drawingDoc.drawings
        });

    } catch (error) {
        console.error('Save Drawings Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

/**
 * @desc    Load drawings for a specific chart (user + symbol, shared across all intervals)
 * @route   GET /api/chart-drawings
 * @access  Private
 */
export const loadDrawings = async (req, res) => {
    try {
        const { symbol } = req.query;
        const userId = req.user._id;

        // Validation
        if (!symbol) {
            return res.status(400).json({
                success: false,
                message: 'Symbol query parameter is required'
            });
        }

        const drawingDoc = await ChartDrawing.findOne({ userId, symbol });

        return res.status(200).json({
            success: true,
            data: drawingDoc ? drawingDoc.drawings : []
        });

    } catch (error) {
        console.error('Load Drawings Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

/**
 * @desc    Delete all drawings for a specific chart (user + symbol)
 * @route   DELETE /api/chart-drawings
 * @access  Private
 */
export const deleteDrawings = async (req, res) => {
    try {
        const { symbol } = req.query;
        const userId = req.user._id;

        // Validation
        if (!symbol) {
            return res.status(400).json({
                success: false,
                message: 'Symbol query parameter is required'
            });
        }

        const result = await ChartDrawing.findOneAndDelete({ userId, symbol });

        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'No drawings found for the specified chart'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Drawings deleted successfully'
        });

    } catch (error) {
        console.error('Delete Drawings Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};
