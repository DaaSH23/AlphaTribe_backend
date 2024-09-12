import mongoose from "mongoose";

const blackListSchema = new mongoose.Schema(
    {
        token: {
            type: String,
            required: [true, "token cant be null."],
            ref: "User"
        },
    },
    { timestamps: true }
);

export default mongoose.model("blackList", blackListSchema);