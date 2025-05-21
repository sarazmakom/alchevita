import mongoose from "mongoose";

const { Schema } = mongoose;

const bookmarkRemedySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    remedy: {
      type: Schema.Types.ObjectId,
      ref: "Remedy",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);
bookmarkRemedySchema.index({ user: 1, remedy: 1 }, { unique: true });

const BookmarkRemedy =
  mongoose.models.BookmarkRemedy ||
  mongoose.model("BookmarkRemedy", bookmarkRemedySchema);

export { BookmarkRemedy };
