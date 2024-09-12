import express from "express";
import { stockPost, allStockPost, singleStockPost, deletePost } from "../controllers/stockController.js";
import {authorization} from "../middleware/authenticate.js";
import { addComment, deleteComment } from "../controllers/commentController.js";
import { likePost, unlikePost } from "../controllers/likeController.js";
const router = express.Router();

//posts
router.post('/posts', authorization, stockPost);
router.get('/posts', authorization, allStockPost);
router.get('/posts/:postId', authorization, singleStockPost);
router.delete('/posts/:postId', authorization, deletePost);
//comments
router.post('/posts/:postId/comments', authorization, addComment);
router.delete('/posts/:postId/comments/:commentId', authorization, deleteComment);
//likes
router.post('/posts/:postId/like', authorization, likePost);
router.delete('/posts/:postId/like', authorization, unlikePost);

export default router;