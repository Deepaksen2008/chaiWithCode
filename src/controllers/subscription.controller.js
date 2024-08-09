import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID")
    }
    const user = await User.findById(req.user._id.toString()).populate("subscriptions")
    if (!user) {
        throw new ApiError(404, "User not found")
    }
    const subscriptions = await Subscription.create({
        channel: channelId,
        subscriber: req.user._id.toString() 
        })
    await user.updateOne({ $push: { subscriptions: subscriptions._id } })
    return res
    .status(200)
    .json(new ApiResponse(200, subscriptions, "Subscription toggled successfully"))
    // TODO: toggle subscription
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID")
    }
    const user = await User.findById(subscriberId).populate("subscriptions")
    if (!user) {
        throw new ApiError(404, "User not found")
    }
    const subscribers = user.subscriptions.map(subscription => subscription.subscriber)
    return res
    .status(200)
    .json(new ApiResponse(200, subscribers, "Subscribed users fetched successfully"))
    // TODO: get user's subscribed channels list
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}