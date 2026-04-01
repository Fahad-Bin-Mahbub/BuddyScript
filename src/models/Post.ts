import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPostDocument extends Document {
  _id: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  content: string;
  image?: string;
  imagePublicId?: string;
  visibility: "public" | "private";
  likes: mongoose.Types.ObjectId[];
  commentsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPostDocument>(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
      index: true,
    },
    content: {
      type: String,
      required: [true, "Post content is required"],
      trim: true,
      maxlength: [5000, "Post content cannot exceed 5000 characters"],
    },
    image: {
      type: String,
      default: undefined,
    },
    imagePublicId: {
      type: String,
      default: undefined,
      select: false,
    },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
      index: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    commentsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret: any) {
        ret.likesCount = ret.likes?.length ?? 0;
        delete ret.__v;
        delete ret.imagePublicId;
        return ret;
      },
    },
  }
);

// Compound index for efficient feed queries: public posts sorted by newest
postSchema.index({ visibility: 1, createdAt: -1 });
// User's own posts sorted by newest
postSchema.index({ author: 1, createdAt: -1 });
// For cursor-based pagination
postSchema.index({ createdAt: -1, _id: -1 });

const Post: Model<IPostDocument> =
  mongoose.models.Post || mongoose.model<IPostDocument>("Post", postSchema);

export default Post;
