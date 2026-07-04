import mongoose from "mongoose";

const ZoneSchema = new mongoose.Schema(
  {
    // DEMAND | SUPPLY
    type: {
      type: String,
      enum: ["DEMAND", "SUPPLY"],
      required: true,
    },

    // ACTIVE | INVALID
    status: {
      type: String,
      enum: ["ACTIVE", "INVALID"],
      default: "ACTIVE",
    },

    // ==========================
    // Zone Price Levels
    // ==========================
    proximal: {
      type: Number,
      required: true,
    },

    distal: {
      type: Number,
      required: true,
    },

    // ==========================
    // Base Information
    // ==========================
    baseCandles: {
      type: Number,
      required: true,
      min: 1,
      max: 3,
    },

    baseStartTime: {
      type: Number,
      required: true,
    },

    baseEndTime: {
      type: Number,
      required: true,
    },

    legInTime: {
      type: Number,
      required: true,
    },

    legOutTime: {
      type: Number,
      required: true,
    },

    // Zone creation time
    zoneTime: {
      type: Number,
      required: true,
    },

    // ==========================
    // Zone Tracking
    // ==========================
    touchCount: {
      type: Number,
      default: 0,
    },

    violatedAt: {
      type: Number,
      default: null,
    },
  },
  {
    _id: true,
  }
);

const MarketZoneSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true,
      index: true,
    },

    interval: {
      type: String,
      required: true,
      index: true,
    },

    // Scanner will stop scanning after reaching this zone
    lastScannedZoneTime: {
      type: Number,
      default: null,
    },

    zones: [ZoneSchema],
  },
  {
    timestamps: true,
  }
);

// One document per Symbol + Timeframe
MarketZoneSchema.index(
  {
    symbol: 1,
    interval: 1,
  },
  {
    unique: true,
  }
);

export default mongoose.model("MarketZone", MarketZoneSchema);