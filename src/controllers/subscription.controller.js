import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    console.log(channelId);
    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID")
    }
    console.log(req.user._id.toString());
    const user = await User.findById(req.user._id.toString()).populate("subscriptions")
    console.log(user);
    if (!user) {
        throw new ApiError(404, "User not found")
    }
    console.log(channelId);
    const channel = await Subscription.findById(channelId)
    console.log(channel);
    if (!channel) {
        throw new ApiError(404, "Channel not found")
    }
    if (user.subscriptions.includes(channelId)) {
        // user.subscriptions = user.subscriptions.filter(id => id.toString() !== channelId)
    } else {
        user.subscriptions.push(channel)
    }
    // await user.save()
    res
        .status(200)
        .json(new ApiResponse(200, user.subscriptions, "Subscription toggled successfully"))
    // TODO: toggle subscription
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params
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