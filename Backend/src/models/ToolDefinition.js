import mongoose from 'mongoose';

const toolDefinitionSchema = new mongoose.Schema({
    tool: {
        type: String,
        required: true,
        unique: true,
    },
    displayName: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
        required: true,
    },
    order: {
        type: Number,
        required: true,
        default: 0,
    },
    enabled: {
        type: Boolean,
        default: true,
    },
    style: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
    },
    options: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
    },
    supports: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
    }
}, {
    timestamps: true,
});

const ToolDefinition = mongoose.model('ToolDefinition', toolDefinitionSchema);
export default ToolDefinition;
