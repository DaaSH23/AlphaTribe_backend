import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: [true, "Comment is reequired"],
        max: 100,
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'stockpost',
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

export default mongoose.model("Comment", commentSchema);

