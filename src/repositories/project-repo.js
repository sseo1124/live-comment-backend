import Project from "../model/Project.js";
import ProjectMember from "../model/ProjectMembership.js";

export async function createProject(projectData) {
  const { name, description, userId } = projectData;

  return await Project.create({ name, description, createdBy: userId });
}

export async function getProjectsbyIds(projectIds) {
  return await Project.find({ _id: { $in: projectIds } }).lean();
}

export async function assignProjectMemebership(projectData) {
  const { projectId, userId, role } = projectData;

  return await ProjectMember.create({ projectId, userId, role });
}

export async function getMembershipsByUserId(userId) {
  return await ProjectMember.find({ userId }).lean();
}
