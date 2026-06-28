import mongoose from 'mongoose';

const pointSchema = new mongoose.Schema({
    time: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    }
}, { _id: false });

const styleSchema = new mongoose.Schema({
    color: {
        type: String,
    },
    width: {
        type: Number,
    },
    lineStyle: {
        type: String,
    }
}, { _id: false });

const drawingItemSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    tool: {
        type: String,
        required: true,
    },
    points: [pointSchema],
    style: styleSchema,
    options: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
    },
    locked: {
        type: Boolean,
        default: false,
    },
    visible: {
        type: Boolean,
        default: true,
    }
}, { _id: false });

const drawingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    symbol: {
        type: String,
        required: true,
    },
    interval: {
        type: String,
        required: true,
    },
    drawings: [drawingItemSchema]
}, {
    timestamps: true
});

// Compound unique index on userId + symbol + interval
drawingSchema.index({ userId: 1, symbol: 1, interval: 1 }, { unique: true });

const Drawing = mongoose.model('Drawing', drawingSchema);

export default Drawing;
