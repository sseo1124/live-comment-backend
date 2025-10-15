import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    urlKey: { type: String, required: true },
    displayUrl: { type: String },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

RoomSchema.index({ projectId: 1, urlKey: 1 }, { unique: true });

const Room = mongoose.model("Room", RoomSchema);

export default Room;
