import type { NextFunction, Request, Response } from "express";

import { type Permission, hasPermission } from "@/utils/role.js";

export const requirePermission = (permission: Permission) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const user = req.user;

    const hasAccess = hasPermission(
      { id: user?.id, role: user?.role },
      permission,
    );

    if (!hasAccess) {
      res.status(403).json({ message: "You do not have permission" });
      return;
    }

    next();
  };
};
