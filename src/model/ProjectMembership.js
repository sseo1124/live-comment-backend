import mongoose from "mongoose";

const ProjectMembershipSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    role: { type: String, enum: ["owner", "member"], default: "owner" },
  },
  { timestamps: true }
);

ProjectMembershipSchema.index({ projectId: 1, userId: 1 }, { unique: true });

const ProjectMember = mongoose.model(
  "ProjectMembership",
  ProjectMembershipSchema
);

export default ProjectMember;
