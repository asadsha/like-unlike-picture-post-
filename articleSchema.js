import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema(
  {
    postBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    description: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    mediaUrl: {
      type: String,
      default: "",
    },
    mediaType: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    userVoteStatus: {
      upvote: {
        type: Boolean,
        default: false,
      },
      downvote: {
        type: Boolean,
        default: false,
      },
    },
    upvoteCount: {
      type: Number,
      default: 0,
    },
    downvoteCount: {
      type: Number,
      default: 0,
    },
    votes: [
      {
        type: {
          type: String,
          required: true,
        },
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    topComments: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Article", ArticleSchema);
