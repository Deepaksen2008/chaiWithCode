import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.model.js"
import { Video } from "../models/video.model.js"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/APIResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }
    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found")
    }
    const user = req.user._id.toString()

    const like = await Like.findOne({ video: videoId, likeBy: user })

    if (!like) {
        await Like.create({
            video: videoId,
            likeBy: user,
        })
        video.likes++
    } else {
        await Like.findByIdAndDelete(like._id)
        video.likes--
    }
    await video.save()
    return res
        .status(200)
        .json(new ApiResponse(200, video, "Like toggled successfully"))
    //TODO: toggle like on video
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID")
    }
    const comment = await Comment.findById(commentId)
    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }
    const user = req.user._id.toString()
    const like = await Like.findOne({ comment: commentId, likeBy: user })
    console.log(like);
    if (!like) {
        const comment = await Like.create({
            comment: commentId,
            likeBy: user,
        })
        comment.likes++
    } else {
        const comment = await Like.findByIdAndDelete(like._id)
        comment.likes--
    }
    // await comment.save()
    return res
        .status(200)
        .json(new ApiResponse(200, comment, "Like on comment toggled successfully"))
    //TODO: toggle like on comment

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID")
    }
    const tweet = await Video.findById(tweetId)
    if (!tweet) {
        throw new ApiError(404, "Tweet not found")
    }
    const user = req.user._id.toString()
    const like = await Like.findOne({ tweet: tweetId, likeBy: user })
    if (!like) {
        const tweet = await Like.create({
            tweet: tweetId,
            likeBy: user,
        })
        tweet.likes++
    } else {
        const tweet = await Like.findByIdAndDelete(like._id)
        tweet.likes--
    }
    return res
        .status(200)
        .json(new ApiResponse(200, tweet, "Like on tweet toggled successfully"))
    //TODO: toggle like on tweet
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    const user = req.user._id.toString()
    const likes = await Like.find({ likeBy: user })
    const videoIds = likes.map((like) => like.video)
    const videos = await Video.find({ _id: { $in: videoIds } })
    return res
    .status(200)
    .json(new ApiResponse(200, videos, "All liked videos fetched successfully"))
    //TODO: get all liked videos
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}