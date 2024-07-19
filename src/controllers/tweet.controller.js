import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    // phela content lo user sa 
    // ownerid: user  login ha to  vha sa la lo

    const { content } = req.body

    if (!content) {
        throw new ApiError(400,"content not provide")
    }

    const owner =  await User.findById(req.user?._id)
    
    if (!owner) {
        throw new ApiError(500,"owner not found")
    }
 

    const tweet = await Tweet.create({
        content: content,
        owner: owner._id 
    });

   
    await tweet.save();

    return res
        .status(200)
        .json(new ApiResponse(200,tweet , "     tweet  create  successfully"))



    
})//completed

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    // phela user id get kro 
    // fir check kro
    const userId = req.user._id
    const tweet = await Tweet.findById({ user: userId }).exec();
    if (!tweet) {
        throw new ApiError(500, " tweet owner id not found")
    }
    await tweet.save();

    return res
        .status(200)
        .json(new ApiResponse(200,tweet , " tweet  get  successfully"))


}) // completed

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    //phela user tweets ha ya nhi
    // fir check kra 

    const { content } = req.body

    if (!content) {
       throw new ApiError(500,"content does not exit")
    }


    const tweet = Tweet.findById(owner?._id)
   if (!tweet) {
      throw new ApiError(500,"owner does not exit")
   }
    
   const tweetUpdate = await Tweet.findByIdAndUpdate(
    tweet._id,
    // req.user?._id,
    {
        $set: {
            content: content,
        }
    },
    { new: true }
)



return res
.status(200)
.json(new ApiResponse(200, tweetUpdate, " Tweet updated successfully"))

})//completed

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet

    // phela tweet get 
    // fir check
    // fir delete
    const tweet = await Tweet.findById(req.user?._id)
    if (!tweet) {
        throw new ApiError(500, " tweet owner id not found")
    }


    const deleteTweet = await Tweet.deleteOne({_id:tweet._id})
    if (!deleteTweet) {
        throw new ApiError(400,"delete twetee")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,{}, "tweet  Delete successfully"))
    

})//completed

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}