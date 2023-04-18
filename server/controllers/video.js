import Video from '../models/Video.js';
import User from '../models/User.js';
import { createError } from '../utils/error.js';

export const addVideo = async (req, res, next) => {
  const newVideo = new Video({ userId: req.user.id, ...req.body });
  try {
    const savedVideo = await newVideo.save();
    res.status(200).json(savedVideo);
  } catch (error) {
    next(err);
  }
};
export const updateVideo = async (req, res, next) => {
  console.log('req', req);
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return next(createError(404, 'Video not Found!'));
    if (req.user.id === video.userId) {
      const updatedVideo = await Video.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedVideo);
    } else {
      return next(createError(403, 'you can update only your video!'));
    }
  } catch (error) {
    next(err);
  }
};
export const deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return next(createError(404, 'Video not Found!'));
    if (req.user.id === video.userId) {
      await Video.findByIdAndDelete(req.params.id);
      res.status(200).json('Video has been deleted');
    } else {
      return next(createError(403, 'you can delete only your video!'));
    }
  } catch (error) {
    next(err);
  }
};
export const getVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    return res.status(200).json(video);
  } catch (error) {
    next(error);
  }
};
export const addView = async (req, res, next) => {
  try {
    await Video.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 },
    });
    return res.status(200).json('The views has been increased');
  } catch (error) {
    next(err);
  }
};
export const random = async (req, res, next) => {
  try {
    const videos = await Video.aggregate([{ $sample: { size: 40 } }]);
    return res.status(200).json(videos);
  } catch (error) {
    next(err);
  }
};
export const trend = async (req, res, next) => {
  try {
    const videos = await Video.find().sort({ views: -1 }); // -1 most viewed and -1 for least viewed video
    return res.status(200).json(videos);
  } catch (error) {
    next(err);
  }
};
export const sub = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const subscribedChannel = user.subscribedUsers;

    const list = await Promise.all(
      subscribedChannel.map((channelId) => {
        return Video.find({ userId: channelId });
      })
    );
    return res
      .status(200)
      .json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
  } catch (error) {
    next(err);
  }
};

export const getByTag = async (req, res, next) => {
  const tags = req.query.tags.split(',');
  try {
    const videos = await Video.find({ tags: { $in: tags } }).limit(20);
    return res.status(200).json(videos);
  } catch (error) {
    next(err);
  }
};
export const search = async (req, res, next) => {
  const query = req.query.q;
  console.log(query);
  try {
    const videos = await Video.find({
      title: { $regex: query, $options: 'i' },
    }).limit(40);
    console.log(videos);
    return res.status(200).json(videos);
  } catch (error) {
    next(err);
  }
};
