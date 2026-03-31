import { Request, Response } from "express";
import prisma from "../config/db.config.js";
import jwt from "jsonwebtoken";

interface GroupUserType {
  name: string;
  group_id: string;
}

class ChatGroupUserController {
  static async index(req: Request, res: Response) {
    try {
      const { group_id } = req.query;
      const users = await prisma.groupUsers.findMany({
        where: {
          group_id: group_id as string,
        },
      });
      return res.json({ message: "Data fetched successfully!", data: users });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Something went wrong. Please try again!" });
    }
  }

  static async store(req: Request, res: Response) {
    try {
      // 1. Verify JWT token
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Unauthorized. Please login first." });
      }

      let decoded: any;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET!);
      } catch {
        return res.status(401).json({ message: "Invalid or expired token." });
      }

      const userId = decoded.id;

      // 2. Verify group + passcode
      const { group_id, passcode } = req.body;

      const group = await prisma.chatGroup.findUnique({
        where: { id: group_id },
      });

      if (!group) {
        return res.status(404).json({ message: "Group not found." });
      }

      if (group.passcode !== passcode) {
        return res.status(403).json({ message: "Incorrect passcode." });
      }

      // 3. Get user from DB
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      // 4. Upsert — if already in group, return existing record
      const groupUser = await prisma.groupUsers.upsert({
        where: {
          group_id_user_id: {
            group_id,
            user_id: userId,
          },
        },
        update: {},
        create: {
          group_id,
          user_id: userId,
          name: user.name,
        },
      });

      return res.json({ message: "User created successfully!", data: groupUser });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Something went wrong. Please try again!" });
    }
  }
}

export default ChatGroupUserController;