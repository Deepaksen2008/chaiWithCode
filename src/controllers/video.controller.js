import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user id")
    }
    const user = await User.findById(userId)
    if (!user) {
        throw new ApiError(404, "User not found")
    }

    const videos = await Video.find({
        $or: [{ title: new RegExp(query, 'i') }, { description: new RegExp(query, 'i') }],
        user: user._id,
        isPublished: true
    })

    const totalVideos = await Video.countDocuments({
        $or: [{ title: new RegExp(query, 'i') }, { description: new RegExp(query, 'i') }],
        user: user._id,
        isPublished: true
    })

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const sortedVideos = videos.sort({ [sortBy]: sortType }).slice(startIndex, endIndex)
    return res.status(200).json(new ApiResponse(200, sortedVideos, "Videos fetched successfully", totalVideos))
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    const { videoFile, thumbnailImage } = req.files
    if (!videoFile && !thumbnailImage) {
        throw new ApiError(400, "Video and thumbnail files cannot be empty")
    }
    const videoLocalPath = videoFile[0].path
    const thumbnailLocalPath = thumbnailImage[0].path
    const video = await uploadOnCloudinary(videoLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
    const userId = req.user._id.toString();

    const videos = await Video.create({
        videoFile: video.url,
        title,
        duration: video.duration,
        description,
        thumbnail: thumbnail.url,
        owner: userId
    })

    return res.status(201).json(new ApiResponse(201, videos, "Video published successfully"))
    // TODO: get video, upload to cloudinary, create video
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found")
    }
    return res.status(200).json(new ApiResponse(200, video, "Video fetched successfully"))
    //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!videoId) {
        throw new ApiError(400, "Invalid video id")
    }
    const { title, description } = req.body
    const thumbnail = req.files
    if (thumbnail) {
        const thumbnailLocalPath = thumbnail[0].path
        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
        await Video.findByIdAndUpdate(videoId, {
            $set: {
                thumbnail: thumbnail.url
            }
        }, { new: true })
    }

    const video = await Video.findByIdAndUpdate(videoId, {
        $set: {
            title,
            description
        }
    }, { new: true })
    if (!video) {
        throw new ApiError(404, "Video not found")
    }
    return res.status(200).json(new ApiResponse(200, video, "Video updated successfully"))
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!videoId) {
        throw new ApiError(400, "Invalid video id")
    }
    const video = await Video.findByIdAndDelete(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found")
    }
    return res.status(200).json(new ApiResponse(200, video, "Video deleted successfully"))
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId) {
        throw new ApiError(400, "Invalid video id");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    video.isPublished = !video.isPublished;
    await video.save();

    return res.status(200).json(new ApiResponse(200, video, "Video status toggled successfully"));
});

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}