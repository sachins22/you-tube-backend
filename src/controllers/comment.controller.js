import mongoose from "mongoose"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    console.log(req.query);
    const offset = (Number(page) - 1) * Number(limit);
    const comments = await Comment.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId),
            },
        },
        {
            $project: {
                content: 1,
                video: 1,
                owner: 1,
            },
        },
        {
            $skip: Number(offset),
        },
        {
            $limit: Number(limit),
        },
    ]);
    if (!comments) throw new ApiError(400, "No comments on this video");

    return res
        .status(200)
        .json(new ApiResponse(200, { comments }, "Comments fetched successfully"));

}) //completed

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video

    // phela video ko jis per comment karna ha
    // content lo 
    //  fir user lo jisna comment karna ha
    // fir teenao ko cheeck karna 
    // comment add karna 


         const { videoId } = req.params;
         if (!videoId) {
            throw new ApiError(500,"comment section ma video id not found ")
         }
            const { content } = req.body;
            if (!content) {
                throw new ApiError(500,"comment section ma content  not found ")
             }
            const user = req.user._id;
            if (!user) {
                throw new ApiError(500,"comment section ma user id not found ")
             }

             const addComment = await Comment.create({
                content,
                videoId:videoId,
                user
             })

             return res
             .status(200)
             .json(new ApiResponse(200, { addComment }, "Comment added successfully"));

}) //completed

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const commentId = req.params;
    const  content  = req.body;
    if (!commentId) {
        throw new ApiError(500,"updateComment section ma commentId  not found ")
    }
  
    if (!content) {
        throw new ApiError(500,"updateComment section ma content  not found ")
     }

     const updateComment = await Comment.findByIdAndUpdate(
        commentId,
       {
        $set:{
            content: content
        }
       },
       { new: true })
 return res
 .status(200)
 .json(new ApiResponse(200, updateComment, " Tweet updated successfully"))
}) //completed

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const commentId = req.params;
    if (!commentId) {
        throw new ApiError(500,"deleteComment section ma commentId  not found ")
    }

    const deleteComment = await Comment.findByIdAndDelete(commentId)
    if (!deleteComment) {
        throw new ApiError(500,"deleteComment section ma deleteComment  not found ")
    }
    return res
    .status(200)
    .json(new ApiResponse(200, deleteComment, " Tweet updated successfully"))


})//completed

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}


