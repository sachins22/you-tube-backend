import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/Cloudinay.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination //gpt
    
    let baseQuery = {};
    if (query) {
        baseQuery = { $or: [{ title: { $regex: query, $options: 'i' } }] };
    }
    if (userId) {
        baseQuery.userId = mongoose.Types.ObjectId(userId); 
    }

   
    let sortOptions = {};
    if (sortBy && sortType) {
        sortOptions[sortBy] = sortType === 'asc' ? 1 : -1;
    }

   
    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNumber - 1) * pageSize;

  
    const videos = await Video.find(baseQuery)
        .sort(sortOptions)
        .skip(skip)
        .limit(pageSize);

    res.json(videos);
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, thumbnail, create video
    // phela titel or description lange 
    //fir check kaenge
    // fir upload kare ngi 
    //fir check kaenge

    console.log(title)
    console.log(description)
    if (!title || !description) {
        throw new ApiError(400,"Titel and Description both are Requried")
    }
    const VideoFileLocalPath = req.files?.VideoFile[0].path;
    const thumbnailPath = req.files?.thumbnail[0].path;
    if (!VideoFileLocalPath) {
        throw new ApiError(400,"video are requried ")
    }
    if (!thumbnailPath) {
        throw new ApiError(400,"thumnail are requried ")
    }
    
    const video = await uploadOnCloudinary(VideoFileLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailPath)
    
    if (!video) {
        throw new ApiError(400,"video are not properly upload ")
    }
    if (!thumbnail) {
        throw new ApiError(400,"video are not properly upload ")
    }
    
    const videoCreate= await Video.create({
        title,
        description,
        video:video.url,
        thumbnail:thumbnail.url
    })
    // await videoCreate.save();

const videoUpload = await videoCreate.findById(videoCreate._id)

if (!videoUpload) {
    throw new ApiError(500,"videoUpload failed please try again")
}

    return res.status(201).json(
        new ApiResponse(200,videoCreate , "video uploaded successfully")
    )


})//completed

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id

    // phela to video kao monodb sa id find kro
    // fir check 
    // mila na to error na to res send

    const existedVideo =  await Video.findById(videoId)
    
    if (!existedVideo) {
        throw new ApiError(500,"ya video DataBase ma koni ha do bara to")
    }

    return res.status(200).json(
        new ApiResponse(200,  "video_ID  found successfully")
    )

})//completed

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
  // update karne sa phale video existed karti ha ya nhi y achek karna 
  // video ha to update na sernd error
  //
  

  //todo : delete the thumbnail first 


    const existedVideo = await Video.findById(videoId)
    
    if (!existedVideo) {
        throw new ApiError(500,"ya video DataBase ma koni ha do bara to")
    }
    const { title, description, } = req.body
    console.log(description);
   

    if (!title || !description) {
        throw new ApiError(400, "All fields are required")
    }
    const thumbnailPath = req.file?.path
    console.log(thumbnailPath);

    if (!thumbnailPath) {
        throw new ApiError(400, "thumbnail file is missing")
    
    }

    const thumbnail = await uploadOnCloudinary(thumbnailPath)
    console.log(thumbnail)

      if (!thumbnail.url) {
          throw new ApiError(400, "Error while uploading on thumbnail")
      }
    
    const video = await Video.findByIdAndUpdate(
        existedVideo,
        {
            $set: {
                title:title,
                description:description,
                thumbnail:thumbnail
            }
        },
        { new: true }

    )

    return res
        .status(200)
        .json(new ApiResponse(200, video, "video details updated successfully"))

})// completed

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
//  phela use video ko check karna  ha vo data ma ha ya nhi
// fir use acsses karna 
// fir delete karna

const existedVideo =  await Video.findById(videoId)
    
if (!existedVideo) {
    throw new ApiError(500,"ya video DataBase ma koni ha do bara to")
}


const video = await Video.deleteOne({_id:videoId})

if (!video) {
    throw new ApiError(500,"video not deleted")
}

return res
.status(200)
.json(new ApiResponse(200,{}, "video  Delete successfully"))



})// completed

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const existedVideo =  await Video.findById(videoId)
    
if (!existedVideo) {
    throw new ApiError(500,"ya video DataBase ma koni ha do bara to")
}
       // Step 3: Toggle the isPublished field
       Video.isPublished = !Video.isPublished;

       // Step 4: Save the changes to the database
       await Video.save();


       return res
       .status(200)
       .json(new ApiResponse(200,{}, "video  is togglePublishStatus successfully"))
       

})// completed

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}