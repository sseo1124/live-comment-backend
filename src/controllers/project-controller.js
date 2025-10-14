import { MEMBERSHIP } from "../config/constants.js";
import {
  assignProjectMemebership,
  createProject,
  getMembershipsByUserId,
  getProjectsbyIds,
} from "../repositories/project-repo.js";

export async function handleCreateProject(req, res, next) {
  const { name, description } = req.body;
  const userId = req.user._id;

  const project = await createProject({ name, description, userId });

  await assignProjectMemebership({
    projectId: project._id,
    userId: project.createdBy,
    role: MEMBERSHIP.OWNER,
  });

  return res.status(201).json({
    project: {
      _id: project._id,
      name: project.name,
      description: project.description || null,
      role: MEMBERSHIP.OWNER,
    },
  });
}

export async function handleGetProjects(req, res, next) {
  const userId = req.user._id;

  const memberships = await getMembershipsByUserId(userId);

  if (memberships.length === 0) {
    return res.json({ projects: [] });
  }

  const projectIds = memberships.map((membership) => membership.projectId);
  const projects = await getProjectsbyIds(projectIds);

  return res.json({ projects });
}
