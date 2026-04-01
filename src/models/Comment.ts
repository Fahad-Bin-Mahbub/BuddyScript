import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICommentDocument extends Document {
  _id: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  parentComment?: mongoose.Types.ObjectId;
  content: string;
  likes: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const commentSchema = new Schema<ICommentDocument>(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: [true, "Post reference is required"],
      index: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
    },
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: undefined,
    },
    content: {
      type: String,
      required: [true, "Comment content is required"],
      trim: true,
      maxlength: [2000, "Comment cannot exceed 2000 characters"],
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret: any) {
        ret.likesCount = ret.likes?.length ?? 0;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Fetch top-level comments for a post
commentSchema.index({ post: 1, parentComment: 1, createdAt: 1 });
// Fetch replies for a comment
commentSchema.index({ parentComment: 1, createdAt: 1 });

const Comment: Model<ICommentDocument> =
  mongoose.models.Comment ||
  mongoose.model<ICommentDocument>("Comment", commentSchema);

export default Comment;
