import mongoose from "mongoose";

const ThreadSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
      index: true,
    },
    content: { type: String, required: true, trim: true },
    resolved: { type: Boolean, default: false },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

ThreadSchema.index({ roomId: 1, createdAt: 1 });

const Thread = mongoose.model("Thread", ThreadSchema);

export default Thread;
