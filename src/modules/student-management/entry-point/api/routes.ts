import { type Application, Router } from "express";
import * as studentManagementController from "../../domain/student-management.controller";

export function defineStudentManagementRoutes(expressApp: Application) {
  const studentManagementRouter = Router();

  studentManagementRouter.post(
    "/register",
    studentManagementController.registerStudents
  );
  studentManagementRouter.get(
    "/commonstudents",
    studentManagementController.getCommonStudents
  );

  studentManagementRouter.post(
    "/suspend",
    studentManagementController.suspendStudent
  );

  studentManagementRouter.post(
    "/retrievefornotifications",
    studentManagementController.getNotificationRecipients
  );

  expressApp.use("/api", studentManagementRouter);
}
