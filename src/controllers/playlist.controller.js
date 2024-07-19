import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {Video}  from "../models/video.model.js"
import { User } from "../models/user.model.js"

const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    //TODO: create playlist
    // phale name or description ko lo 
    // fir check kro 
//   video ko video sa la
// owner ko user sa la 
// fir dono ko chek kra  
// fir playlist bnaye

console.log(name,description);

if (!name || description) {
    throw new ApiError(400,"name and description  in playList not found")
}



  const videoId = req.body.videoId;
  const ownerId = req.body.userId;

const videos = await Video.findById(videoId)
if (!videos) {
    throw new ApiError(500,"videos not found in playList")
}

const owner = await User.findById(ownerId)
if (!owner) {
    throw new ApiError(500,"owner not found in playList")
}


const playList = await Playlist.create({
    name,
    description,
    videos:videoId,
    owner
})

await playList.save();

return res
.status(201)
.json(
    new ApiResponse(200,  playList , "playList uploaded successfully"))


})//completed


const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    //TODO: get user playlists
    const user = await User.findById(userId);
    if (!user) throw new ApiError(400, "No such user exists");
    const playlists = await Playlist.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId),
            },
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "uservideos",
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "completedoc",
            },
        },
        {
            $addFields: {
                totalVideos: {
                    $size: "$uservideos",
                },
                totalViews: {
                    $sum: "$uservideos.views",
                },
                owner: {
                    $first: "$completedoc",
                },
            },
        },
        {
            $project: {
                name: 1,
                description: 1,
                createdAt: 1,
                updatedAt: 1,
                totalVideos: 1,
                totalViews: 1,
                uservideos: {
                    _id: 1,
                    "videoFile.url": 1,
                    "thumbnail.url": 1,
                    title: 1,
                    description: 1,
                    duration: 1,
                    createdAt: 1,
                    views: 1,
                },
                completedoc: {
                    username: 1,
                    fullName: 1,
                    "avatar.url": 1,
                },
            },
        },
    ]);
    if (!playlists)
        throw new ApiError(404, "Error in retrieving playlists of user");
    return res
        .status(200)
        .json(new ApiResponse(200, { playlists }, "Playlist retrieval success"));
});//completed


const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    // console.log(playlistId);
    // console.log(req.params);
    //TODO: get playlist by id
    if (!playlistId) {
        throw new ApiError(400, "Invalid playlist");
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) throw new ApiError(400, "Error in retrieving playlist");
    
    const playlistVideos = await Playlist.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(playlistId),
            },
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos",
            },
        },
        {
            $match: {
                "videos.isPublished": true,
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
            },
        },
        {
            $addFields: {
                totalVideos: {
                    $size: "$videos",
                },
                totalViews: {
                    $sum: "$videos.views",
                },
                owner: {
                    $first: "$owner",
                },
            },
        },
        {
            $project: {
                name: 1,
                description: 1,
                createdAt: 1,
                updatedAt: 1,
                totalVideos: 1,
                totalViews: 1,
                videos: {
                    _id: 1,
                    "videoFile.url": 1,
                    "thumbnail.url": 1,
                    title: 1,
                    description: 1,
                    duration: 1,
                    createdAt: 1,
                    views: 1,
                },
                owner: {
                    username: 1,
                    fullName: 1,
                    "avatar.url": 1,
                },
            },
        },
    ]);
    // const finaldata
    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { playlistVideos },
                "Playlist retrieved successfully"
            )
        );
});//completed


const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    // phali dono id check kra 
    // fir usma video ko add krna 

    if (!playlistId) {
        throw new ApiError(500,"playlistId  is not found")
    }
    if (!videoId) {
        throw new ApiError(500,"videoId  is not found")
    }

const addVideo = await Playlist.findByIdAndUpdate(
    playlistId,
    {
        $push:{
            videoId:videoId
        }
    },
    {
        new: true
    }
)

if (!addVideo) {
    throw new ApiError(500,"video  is not add a playList")
}

return res
.status(200)
.json(new ApiResponse(200,addVideo , "Add Video in playlist   successfully"));


})//completed

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist

  // phali dono id check kra 
    // fir usma video ko remove kardo

    if (!playlistId) {
        throw new ApiError(500,"playlistId  is not found")
    }
    if (!videoId) {
        throw new ApiError(500,"videoId  is not found")
    }

const removeVideo = await Playlist.findByIdAndUpdate(
    playlistId,
    {
        $pull: {
            videos: videoId,
          }
    },
    {
        new: true
    }
)

if (!removeVideo) {
    throw new ApiError(500,"video  is not remove a playList")
}

return res
.status(200)
.json(new ApiResponse(200,removeVideo , "remove   Video in playlist   successfully"));




})//completed

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    // phale playlistId check kro 
    // fir use delete kro do
    if (!playlistId) {
        throw new ApiError(500,"playlistId  is not found")
    }

const deletePlayList = await Playlist.findByIdAndDelete(playlistId)

if (!deletePlayList) {
    throw new ApiError(500,"playlist  is not found")
}
return res
.status(200)
.json(new ApiResponse(200,deletePlayList , " deletePlaylist  successfully"));
    

})//completed

const updatePlaylist = asyncHandler(async (req, res) => {
        const {playlistId} = req.params
        const {name, description} = req.body
        //TODO: update playlist
    
        // phale tenno ko check kra 
        // fir old ki jgha new set kra 
    
        if (!playlistId) {
            throw new ApiError(500,"playlistId  is not found") 
        }
      
        if (!name || !description) {
            throw new ApiError(500,"Both name and description is requried ") 
        }
    
        const updatePlaylist = await Playlist.findByIdAndUpdate(
            playlistId,
            {
                $set:{
                    name:name,
                    description:description,
                }
            },
            {
              new: true,
            }
          );
     
          if (!updatePlaylist) {
            throw new ApiError(500,"updatePlaylist is not found ") 
        }

        return res
        .status(200)
        .json(new ApiResponse(200,updatePlaylist , " updatePlaylist  successfully"));
    
})//completed



export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}