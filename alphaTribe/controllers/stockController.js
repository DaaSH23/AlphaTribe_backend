import stockPostModel from "../models/stockPostModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { catchAsyncError } from "../middleware/catchAsyncError.js";
import commentModel from "../models/commentModel.js";


// Create a Stock Post
const stockPost = catchAsyncError(async(req, res, next)=>{
    try{
        const {userId} = req.user;
        const {stockSymbol, title, description, tags} = req.body;

        if(!stockSymbol || !title || !description ){
            return next(new ErrorHandler("Stock symbol, title and description are required", 400));
        }
        const post = await stockPostModel.create({
            stockSymbol: stockSymbol,
            title: title,
            description: description,
            tags: tags || [],
            user: userId,
            createdAt: Date.now(),
        });

        res.status(200).json({
            success: true,
            postId: post._id,
            message: "Post created successfully"
        });

    }catch(err){
        console.error("Error posting, error: ", err);
        res.status(500).json({
            seccess: false,
            message: "Error posting",
            Error: err
        })
    }
});

// Get All Stock Posts (with filters and sorting)
const allStockPost = catchAsyncError(async(req, res, next)=>{
    try{
        const {stockSymbol, tags, sortBy, page=1, limit=10} = req.query;

        const pageNumber = parseInt(page, 10);
        const pageSize = parseInt(limit, 10);

        if (isNaN(pageNumber) || pageNumber < 1) {
            return next(new ErrorHandler("Invalid page number", 400));
        }
        if (isNaN(pageSize) || pageSize < 1) {
            return next(new ErrorHandler("Invalid limit", 400));
        }

        // filter object based on query parameter
        let filter = {};
        // Object for sortby
        let sortOption = {};

        if(stockSymbol){
            filter.stockSymbol = stockSymbol.toUpperCase();
        }
        if(tags){
            filter.tags = {$in: tags.split(',')};
        }
        if(sortBy === 'date'){
            sortOption.createdAt = -1;       // sort createdAt date by decending order  
        } else if(sortBy === 'likes'){
            sortOption.likesCount = -1;      // sort likes count by decending order
        } else{
            sortOption.createdAt = -1;       // Default sorting by creation date
        }

        //metadata: get the total no. of posts
        const totalPosts = await stockPostModel.countDocuments(filter);

        const posts = await stockPostModel
            .find(filter)
            .sort(sortOption)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .exec();

        const resPost = posts.map(post => ({
            postId: post._id,
            stockSymbol: post.stockSymbol,
            title: post.title,
            description: post.description,
            likesCount: post.likes ? post.likes.length : 0,
            createdAt: post.createdAt
        }));

        res.status(200).json({
            success: true,
            data: resPost,
            pagination: {
                totalPosts: totalPosts,
                totalPages: Math.ceil(totalPosts / pageSize),
                currentPage: pageNumber,
                pageSize: pageSize
            }
        });

    }catch(err){
        console.error("Error fetching post data", err);
        res.status(500).json({
            seccess: false,
            message: "Error fetching post data",
            Error: err
        })
    }
});

const singleStockPost = catchAsyncError(async(req, res, next)=>{
    try{
        const {postId} = req.params;
        
        const post = await stockPostModel
            .findById(postId)
            .populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    model: 'users',
                    select: 'userId username'
                }
            })
            .exec();


        if(!post){
            return next(new ErrorHandler("Post not found", 404));
        }

        console.log(post);

        res.status(200).json({
            postId: post._id,
            stockSymbol: post.stockSymbol,
            title: post.title,
            description: post.description,
            likesCount: post.likes ? post.likes.length : 0,
            comments: post.comments.map(com => ({
                commentId: com._id,
                userId: com.user ? com.user.userId : null, // Check if user exists
                username: com.user ? com.user.username : null, // Check if user exists
                comment: com.comment,
                createdAt: com.createdAt
            }))
        });
    }catch(err){
        console.error("Error fetching post data, Error: ", err);
        res.status(500).json({
            seccess: false,
            message: "Error fetching post data",
            Error: err
        })
    }
})

// Delete post
const deletePost = catchAsyncError(async(req, res, next)=>{
    try{
        const {postId} = req.params;

        const post = await stockPostModel.findById(postId);
        if(!post){
            return next(new ErrorHandler("Post not found", 404));
        }
        // Delete all comment related with that post
        await commentModel.deleteMany({post: postId});

        // Delete post
        await stockPostModel.findByIdAndDelete(postId);

        res.status(200).json({
            success: true,
            message: "Post deleted successfully",
        });
    }catch(err){
        console.error("Error deleting post, Error: ", err);
        res.status(500).json({
            seccess: false,
            message: "Error deleting post",
            Error: err
        })
    }
})

export {stockPost, allStockPost, singleStockPost, deletePost};
