// controller.ts
import type { Request, Response, NextFunction } from "express";
import {
  commonStudentsValidatorSchema,
  notificationValidatorSchema,
  registerStudentsValidatorSchema,
  suspendStudentValidatorSchema,
} from "./student-management.validator";
import logger from "../../../utils/logger";
import {
  getCommonStudentsService,
  getNotificationRecipientsService,
  registerStudentsService,
  suspendStudentService,
} from "./student-management.service";

export async function registerStudents(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const { error, value } = registerStudentsValidatorSchema.validate(req.body);
    if (error) {
      const messages = error.details.map((detail) => detail.message);
      logger.warn("Validation error on registerStudents", error.details);
      return res.status(400).json({ message: messages });
    }

    const { teacher, students } = value;

    await registerStudentsService(teacher, students);
    return res
      .status(204)
      .json({ message: "Students registered successfully" });
  } catch (err) {
    logger.error("Error in registerStudents controller", err);
    next(err);
  }
}

export const getCommonStudents = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { error, value } = commonStudentsValidatorSchema.validate(req.query);

    if (error) {
      const messages = error.details.map((detail) => detail.message);
      logger.warn("Validation error on getCommonStudents", error.details);
      return res.status(400).json({ message: messages });
    }

    const teacherEmails = Array.isArray(value.teacher)
      ? value.teacher
      : [value.teacher];
    const students = await getCommonStudentsService(teacherEmails);
    return res.status(200).json({ students });
  } catch (err) {
    next(err);
  }
};

export const suspendStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { error, value } = suspendStudentValidatorSchema.validate(req.body);
    if (error) {
      const messages = error.details.map((detail) => detail.message);
      logger.warn("Validation error on suspendStudent", error.details);
      return res.status(400).json({ message: messages });
    }
    const { student: studentEmail } = value;
    await suspendStudentService(studentEmail);
    return res.status(204).json({ message: "Student suspended successfully" });
  } catch (err) {
    next(err);
  }
};

export const getNotificationRecipients = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { error, value } = notificationValidatorSchema.validate(req.body);
    if (error) {
      const messages = error.details.map((detail) => detail.message);
      logger.warn(
        "Validation error on getNotificationRecipients",
        error.details
      );
      return res.status(400).json({ message: messages });
    }

    const { teacher, notification } = value;

    const recipients = await getNotificationRecipientsService(
      teacher,
      notification
    );
    return res.status(200).json({ recipients });
  } catch (err) {
    next(err);
  }
};
