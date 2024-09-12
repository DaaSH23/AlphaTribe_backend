import { catchAsyncError } from "../middleware/catchAsyncError.js";
import stockPostModel from "../models/stockPostModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";

const likePost = catchAsyncError(async(req, res, next)=>{
    try{
        const {postId} = req.params;

        const post = await stockPostModel.findById(postId);

        if(!post){
            return next(new ErrorHandler("Post not found", 404));
        }

        if(post.likes.includes(req.user.userId)){
            return next(new ErrorHandler("Post already liked", 400));
        }

        post.likes.push(req.user.userId);
        await post.save();

        req.io.emit('likePost', {
            postId: postId,
            userId: req.user.userId
        });

        res.status(200).json({
            success: true,
            message: "Post liked",
        });
    }catch(err){
        console.error("Error liking the post, Error: ", err);
        res.status(500).json({
            success: false,
            message: "Error liking post",
            Error: err,
           });
    }
});

const unlikePost = catchAsyncError(async(req, res, next)=>{
    try{
        const {postId} = req.params;

        const post = await stockPostModel.findById(postId);
        if(!post){
            return next(new ErrorHandler("Post not found", 404));
        };

        if(!post.likes.includes(req.user.userId)){
            return next(new ErrorHandler("Post not yet liked", 400));
        }

        post.likes = post.likes.filter(likeId => likeId.toString() !== req.user.userId.toString());
        await post.save();

        req.io.emit('unlikePost', {
            postId: postId,
            userId: req.user.userId,
        })

        res.status(200).json({
            success: true,
            message: "Post unliked",
        });
    }catch(err){
        console.error("Error unliking the post, Error: ", err);
        res.status(500).json({
            success: false,
            message: "Error unliking post",
            Error: err,
           });
    }
})

export {likePost, unlikePost};