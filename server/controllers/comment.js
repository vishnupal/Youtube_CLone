import Comment from '../models/Comment.js';
import Video from '../models/Video.js';
import { createError } from '../utils/error.js';

export const addComment = async (req, res, next) => {
  const newComment = new Comment({ ...req.body, userId: req.user.id });
  try {
    const savedComment = await newComment.save();
    res.status(200).json(savedComment);
  } catch (error) {
    next(error);
  }
};
export const deleteComment = async (req, res, next) => {
  try {
    //only delete when if try by owner of comment or video owner
    const comment = await Comment.findById(res.params.id);
    const video = await Video.findById(res.params.id);
    //if user id and comment userId same then delete or user id and video userId same then he can delete comment
    if (req.user.id === comment.userId || req.user.id === video.userId) {
      await Comment.findByIdAndDelete(res.params.id);
      res.status(200).json('The comment has been deleted');
    } else {
      return next(createError(403, 'You can delete only your comment!'));
    }
  } catch (error) {
    next(error);
  }
};
export const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ videoId: req.params.videoId });
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};
