import mongoose from "mongoose";

const candleSchema = new mongoose.Schema(
    {
        time: {
            type: Number,
            required: true
        },
        open: {
            type: Number,
            required: true
        },
        high: {
            type: Number,
            required: true
        },
        low: {
            type: Number,
            required: true
        },
        close: {
            type: Number,
            required: true
        }
    },
    { _id: false }
);

const baseCandleGroupSchema = new mongoose.Schema(
    {
        baseCandles: {
            type: [candleSchema],
            required: true,
            validate: {
                validator: (arr) => arr.length >= 1 && arr.length <= 3,
                message: "Base candle group must contain 1 to 3 candles."
            }
        },

        legIn: {
            type: candleSchema,
            required: true
        },

        legOut: {
            type: candleSchema,
            required: true
        },

        baseStartTime: {
            type: Number,
            required: true
        },

        baseEndTime: {
            type: Number,
            required: true
        },


        validation: {
            legInPassed: Boolean,
            legOutPassed: Boolean
        },

        detectedAt: {
            type: Date,
            default: Date.now
        }
    },
    { _id: false }
);

const ftfSchema = new mongoose.Schema(
    {
        symbol: {
            type: String,
            required: true,
            index: true
        },

        interval: {
            type: String,
            required: true,
            index: true
        },

        latestBaseTimestamp: {
            type: Number,
            default: 0
        },

        baseCandleGroups: {
            type: [baseCandleGroupSchema],
            default: []
        }
    },
    {
        timestamps: true
    }
);

ftfSchema.index(
    {
        symbol: 1,
        interval: 1
    },
    {
        unique: true
    }
);

export default mongoose.model("FTF", ftfSchema);