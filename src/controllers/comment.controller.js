import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/APIResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    if (!videoId) {
        throw new ApiError(400, "Invalid video ID")
    }
    const comments = await Comment.find({video: videoId}).populate("owner", "fullName")
    return res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments retrieved successfully"))    
    //TODO: get all comments for a video

})

const addComment = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const {content} = req.body
    if (!content.trim()) {
        throw new ApiError(400, "content is required")
    }
    const newComment = await Comment.create({
        content: content.trim(),
        video: videoId,
        owner: req.user._id
    })
    return res
    .status(400)
    .json(new ApiResponse(200, newComment, "Comment added successfully"))
    // TODO: add a comment to a video
})

const updateComment = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    const {content} = req.body
    if (!content.trim()) {
        throw new ApiError(400, "content is required")
    }
    const updatedComment = await Comment.findByIdAndUpdate(commentId, 
        {content: content.trim()}, 
        {new: true}).populate("owner", "fullName")

    return res
    .status(400)
    .json(new ApiResponse(200, updatedComment, "Comment updated successfully"))
    // TODO: update a comment
})

const deleteComment = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    if (!commentId) {
        throw new ApiError(400, "Invalid comment ID")
    }
    await Comment.findByIdAndDelete(commentId)
    return res
    .status(400)
    .json(new ApiResponse(200, null, "Comment deleted successfully"))
    // TODO: delete a comment
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }