import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/APIResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    if (!channelId) {
        throw new ApiError(400, "Invalid channel ID")
    }
    const videoCount = await Video.countDocuments({ channel: channelId })
    const subscriberCount = await Subscription.countDocuments({ channel: channelId })
    const likeCount = await Like.countDocuments({ video: { $in: await Video.find({ channel: channelId }).map((video) => video._id) } })
    return res
    .status(200)
    .json(new ApiResponse(200, { videoCount, subscriberCount, likeCount }, "Channel stats fetched successfully"))
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
})

export {
    getChannelStats, 
    getChannelVideos
    }