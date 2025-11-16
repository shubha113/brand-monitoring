import mongoose from "mongoose";

const mentionSchema = new mongoose.Schema({
    source: {
        type: String,
        required: true,
        enum: ['twitter', 'reddit', 'news', 'blog', 'forum']
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        default: 'Anonymous'
    },
    url: {
        type: String,
        required: true
    },
    sentiment: {
        type: String,
        enum: ['positive', 'negative', 'neutral'],
        required: true
    },
    sentimentScore: {
        type: Number,
        default: 0
    },
    topic: {
        type: String,
        default: 'general'
    },
    keywords: [{
        type: String
    }],
    engagement: {
        likes: { type: Number, default: 0 },
        shares: { type: Number, default: 0 },
        comments: { type: Number, default: 0 }
    },
    publishedAt: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

mentionSchema.index({ publishedAt: -1 });
mentionSchema.index({ sentiment: 1 });
mentionSchema.index({ source: 1 });
mentionSchema.index({ topic: 1 });

const Mention = mongoose.model("Mention", mentionSchema);

export default Mention;