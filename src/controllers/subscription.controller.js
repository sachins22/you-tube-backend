import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
// phela user check karna
// fir check  karna 
// subscribe ha ya nhi ha
//   fir check karna 
   
const userId = await User.findById(req.user?._id)

 if (!userId) {
    throw new ApiError(500,"subscriber user not found")
 }

 const existingSubscription = await Subscription.findOne({ channelId:channelId,userId:userId})

 if (!existingSubscription) {
    throw new ApiError(500,"existingSubscription user not found")
      
 }


    // User is already subscribed, so unsubscribe them
         const deleteSubscriber= await Subscription.findByIdAndDelete(existingSubscription._id);
      
         if (!deleteSubscriber) {
            throw new ApiError(500,"deleteSubscriber successfully")
              
         }

    const AgainSubscription = new Subscription({ channelId: channelId, userId:userId  });

    if (!AgainSubscription) {
        throw new ApiError(500,"Again  Subscription  not successfully ")
          
     }

    await AgainSubscription.save();


    
    return res
    .status(200)
    .json(new ApiResponse(200,{}, " toggleSubscription successfully"))

})// completed

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
  
    // First, check if there are any subscribers for the given channel
    const subscriberCount = await Subscription.countDocuments({ channel: channelId });
    if (subscriberCount === 0) {
      throw new ApiError(404, "No subscribers found for this channel");
    }
  
    // Then, find the subscribers for the given channel
    const subscriberList = await Subscription.find({ channel: channelId })
      .populate("subscriber", "username email")
      .exec();
  
    if (!subscriberList) {
      throw new ApiError(500, "Failed to retrieve subscriber list");
    }
  
    return res
      .status(200)
      .json(new ApiResponse(200, subscriberList, "Subscriber list generated successfully"));
  });

// Controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;
  
    // First, find the subscriber
    const subscriber = await Subscriber.findById(subscriberId);
    if (!subscriber) {
      throw new ApiError(404, "Subscriber not found");
    }
  
    // Then, find the channels to which the subscriber has subscribed
    const channelList = await Subscription.find({ subscriber: subscriberId })
      .populate("channel", "name")
      .exec();
  
    if (!channelList || channelList.length === 0) {
      throw new ApiError(404, "No channels found for this subscriber");
    }
  
    return res
      .status(200)
      .json(new ApiResponse(200, channelList, "Channel list generated successfully"));
  });//completed

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}