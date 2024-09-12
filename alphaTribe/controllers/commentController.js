import stockPostModel from "../models/stockPostModel.js";
import commentModel from "../models/commentModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { catchAsyncError } from "../middleware/catchAsyncError.js";

const addComment = catchAsyncError(async(req, res, next)=>{
    try{
        const { comment } = req.body;
        const postId = req.params.postId;

        // console.log("Postid: ", postId);

        if(!comment) {
            return next(new ErrorHandler("Comment cannot be empty", 400));
        }

        const post = await stockPostModel.findById(postId);
        if(!post){
            return next(new ErrorHandler("Post not found", 404));
        }
        // console.log("post: ", post);

        const newComment = await commentModel.create({
            comment: comment,
            post: postId,
            user: req.user._id,
            createdAt: Date.now(),
        });
        // console.log(newComment);
        //push the new comment to the post
        post.comments.push(newComment._id);
        await post.save();

        // Emit the socket.io event to notify the client about the new comment
        req.io.emit('newComment', {
            postId: postId,
            comments: {
                id: newComment._id,
                userId: req.user.userId,
                comment: newComment.comment,
                createdAt: newComment.createdAt,
            }
        }); 

        res.status(200).json({
            success: true,
            message: "Comment added successfully",
            commentId: newComment._id
        })

    }catch(err){
       console.error("Error posting comment, error: ", err);
       res.status(500).json({
        success: false,
        message: "Error posting comment",
        Error: err,
       });
    }
});

const deleteComment = catchAsyncError(async(req, res, next)=>{
    try{
        const {postId, commentId} = req.params;

        // check if the post exists
        const post = await stockPostModel.findById(postId);
        if(!post){
            return next(new ErrorHandler("Post not found", 404));
        }

        // check if the comment exists
        const comment = await commentModel.findById(commentId);
        if(!comment){
            return next(new ErrorHandler("Comment not found", 404));
        }

        // Check for the user authorization to delete
        if(comment.user.toString() !== req.user._id.toString()){
            return next(new ErrorHandler("You are not authorized to delete this comment", 403));
        }

        // Remove the comment from the post's array
        post.comments = post.comments.filter(
            (commentIdInPost) => commentIdInPost.toString() !== commentId
        );
        await post.save();

        // Delete the comment itself
        await commentModel.findByIdAndDelete(commentId);

        // Emit an socket event
        req.io.emit('commentDelete',{
            postId: postId,
            commentId: commentId,
        });

        res.status(200).json({
            success: true,
            message: "Comment deleted successfully",
        })
    }catch(err){
        console.error("Error deleting comment, Error: ", err);
        res.status(500).json({
            success: false,
            message: "Error deleting comment",
            Error: err,
           });
    }
})


export {addComment, deleteComment};