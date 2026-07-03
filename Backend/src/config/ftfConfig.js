/**
 * ============================================================
 * Follow The Footprint (FTF) Strategy Configuration
 * ============================================================
 * All strategy calculations should import values from here.
 *
 * Example:
 * import { FTF_CONFIG } from "../config/ftfConfig.js";
 * ============================================================
 */

export const FTF_CONFIG = {

    strategy: {
        name: "Follow The Footprint",
        version: "1.0.0"
    },

    /**
     * ============================================================
     * BASE CANDLE
     * ============================================================
     */
    base: {

        // Body must be less than 50% of total candle range.
        maxBodyPercentOfRange: 0.50,

        // Allowed consecutive base candles.
        minCandles: 1,
        maxCandles: 3
    },

    /**
     * ============================================================
     * LEG-IN
     * ============================================================
     */
    legIn: {

        // Body should be 15% larger than largest base body.
        bodyIncreasePercent: 15
    },

    /**
     * ============================================================
     * LEG-OUT
     * ============================================================
     */
    legOut: {

        // Body should be 15% larger than largest base body.
        bodyIncreasePercent: 15,

        // Only completed candles are evaluated.
        requireClosedCandle: true
    },

    /**
     * ============================================================
     * DEMAND ZONE
     * ============================================================
     */
    demandZone: {

        proximal: "HIGHEST_BODY",

        distal: "LOWEST_WICK"
    },

    /**
     * ============================================================
     * SUPPLY ZONE
     * ============================================================
     */
    supplyZone: {

        proximal: "LOWEST_BODY",

        distal: "HIGHEST_WICK"
    },

    /**
     * ============================================================
     * ZONE MANAGEMENT
     * ============================================================
     */
    zone: {

        // Zone becomes invalid if price crosses distal line.
        invalidateOnCross: true,

        // Store invalid zones for future analysis.
        keepInvalidatedZones: true,

        // Store active zones.
        keepActiveZones: true,

        // Zone types
        types: {
            DEMAND: "DEMAND",
            SUPPLY: "SUPPLY"
        },

        // Status
        status: {
            ACTIVE: "ACTIVE",
            INVALID: "INVALID"
        }
    },

    /**
     * ============================================================
     * SCANNER
     * ============================================================
     */
    scanner: {

        // Historical scan direction.
        direction: "RIGHT_TO_LEFT",

        // Ignore live candle.
        onlyClosedCandles: true,

        // Re-check after every completed candle.
        liveScan: true,

        // Detect new zones.
        detectNewZones: true,

        // Validate existing zones.
        validateExistingZones: true
    },

    /**
     * ============================================================
     * FUTURE FEATURES
     * ============================================================
     */

    trend: {

        enabled: false
    },

    decisionMatrix: {

        enabled: false
    },

    probabilityEnhancer: {

        enabled: false,

        minimumScore: 11,

        rejectIfAnyZero: true
    },

    notifications: {

        telegram: false,

        whatsapp: false,

        email: false
    }
};

export default FTF_CONFIG;