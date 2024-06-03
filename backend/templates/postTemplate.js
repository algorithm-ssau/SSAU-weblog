import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
  {
    postTitle: {
      type: String,
      required: true,
    },
    postText: {
      type: String,
      required: true,
      unique: true,
    },
    postTags: {
      type: Array,
      default: [],
    },
    postViewsCount: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    postImageUrl: String,
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('post', PostSchema);
