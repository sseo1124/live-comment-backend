import createHttpError from "http-errors";

import mongoose from "mongoose";
import Room from "../model/Room.js";
import ProjectMember from "../model/ProjectMembership.js";

import { toUrlKey } from "../lib/url-key.js";
import { ERROR_MESSAGE, MEMBERSHIP } from "../config/constants.js";
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

export async function handleUpsertRoom(req, res, next) {
  const session = await mongoose.startSession();
  try {
    const { projectId } = req.params;
    const { url } = req.body || {};
    const userId = req.user._id;

    if (!url) return next(createHttpError(400, ERROR_MESSAGE.URL_NOT_FOUND));

    const membership = await ProjectMember.findOne({ projectId, userId })
      .select("_id")
      .lean();

    if (!membership) {
      return next(createHttpError(400, ERROR_MESSAGE.NOT_AUTHORIZED));
    }

    const urlKey = toUrlKey(String(url));

    let room;
    await session.withTransaction(async () => {
      room = await Room.findOneAndUpdate(
        { projectId, urlKey },
        {
          $setOnInsert: {
            projectId,
            urlKey,
            displayUrl: url,
            createdBy: userId,
          },
        },
        { new: true, upsert: true, session }
      ).lean();
    });

    return res.json({ room });
  } catch (e) {
    return next(createHttpError(400, e.message));
  } finally {
    session.endSession();
  }
}
