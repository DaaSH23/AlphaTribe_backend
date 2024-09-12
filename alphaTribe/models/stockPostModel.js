import mongoose from "mongoose"

const stockPostSchema = new mongoose.Schema({
    stockSymbol: {
        type: String,
        required: [true, "Stock symbol is required"]
    },
    title: {
        type: String,
        required: [true, "Title is required"]
    },
    description: {
        type: String,
        required: [true, "Description is required"]
    },
    tags: {
        type: [String],
        default: []
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    }],
    comments: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Comment',
        // ref: 'users'
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

export default mongoose.model("stockpost", stockPostSchema);
