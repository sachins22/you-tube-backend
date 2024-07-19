import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video

    // phela video id check karni
    // fir user id lane
    // fir check karne
    // fir like karna jo pkhela sa ho use delete krna

if (!videoId) {
    throw new ApiError(400,"like section ma video not found")
}

const userId = req.user._id;

if (!userId) {
    throw new ApiError(400,"like section ma owner not found")
}



const existingLike = await Like.findOne({ video: videoId, likedBy: userId })
if (!existingLike) {
    throw new ApiError(400,"like section ma Like not found")  
}
const deleteLike = await Like.deleteOne({existingLike:existingLike._id})

if (!deleteLike) {
    throw new ApiError(400,"like section ma  unlike  successfully")  
}

const addLike = await Like.create({videoId:videoId,owner:userId})

if (!addLike) {
    throw new ApiError(400,"like section ma addLike not found")  
}

return res
.status(200)
.json(new ApiResponse(200, {addLike }, " videos per like  successfully"));


})//completed

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment


    // phela commentId id check karni
    // fir user id lane
    // fir check karne
    // fir like karna jo pkhela sa ho use delete krna

if (!commentId) {
    throw new ApiError(400,"like section ma comment not found")
}

const userId = req.user._id;

if (!userId) {
    throw new ApiError(400,"like section ma owner not found")
}



const existingLike = await Like.findOne({ comment: commentId, likedBy: userId })
if (!existingLike) {
    throw new ApiError(400,"like section ma commentLike not found")  
}
const deleteLike = await Like.deleteOne({existingLike:existingLike._id})

if (!deleteLike) {
    throw new ApiError(400,"like section ma comment unlike  successfully")  
}

const addLike = await Like.create({comment: commentId,owner:userId})

if (!addLike) {
    throw new ApiError(400,"like section ma comment addLike not found")  
}

return res
.status(200)
.json(new ApiResponse(200, {addLike }, " comment percomment like  successfully"));

})//completed

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    
    // phela tweetId id check karni
    // fir user id lane
    // fir check karne
    // fir like karna jo pkhela sa ho use delete krna

if (!tweetId) {
    throw new ApiError(400,"like section ma tweetId not found")
}

const userId = req.user._id;

if (!userId) {
    throw new ApiError(400,"like section ma owner not found")
}



const existingLike = await Like.findOne({ tweet: tweetId, likedBy: userId })
if (!existingLike) {
    throw new ApiError(400,"like section ma tweetLike not found")  
}
const deleteLike = await Like.deleteOne({existingLike:existingLike._id})

if (!deleteLike) {
    throw new ApiError(400,"like section ma tweet unlike  successfully")  
}

const addLike = await Like.create({tweet: tweetId,owner:userId})

if (!addLike) {
    throw new ApiError(400,"like section ma tweet addLike not found")  
}

return res
.status(200)
.json(new ApiResponse(200, {addLike }, " tweet per tweet like  successfully"));


})//completed

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const likedVideos = await Like.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(req.user._id),
                video: { $exists: true },
            },
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "videodetail",
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "likedBy",
                foreignField: "_id",
                as: "userdetail",
            },
        },
        {
            $project: {
                video: 1,
                videodetail: {
                    _id: 1,
                    videoFile: 1,
                    thumbnail: 1,
                },
                userdetail: {
                    _id: 1,
                    username: 1,
                },
            },
        },
    ]);
    return res
        .status(200)
        .json(new ApiResponse(200, { likedVideos }, "Liked videos are"));
});//completed

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}

