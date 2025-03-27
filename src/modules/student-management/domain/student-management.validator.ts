import Joi from "joi";

export const registerStudentsValidatorSchema = Joi.object({
  teacher: Joi.string().email().required(),
  students: Joi.array().items(Joi.string().email()).min(1).required(),
});

export const commonStudentsValidatorSchema = Joi.object({
  teacher: Joi.alternatives()
    .try(Joi.string().email(), Joi.array().items(Joi.string().email()))
    .required(),
});

export const suspendStudentValidatorSchema = Joi.object({
  student: Joi.string().email().required(),
});

export const notificationValidatorSchema = Joi.object({
  teacher: Joi.string().email().required(),
  notification: Joi.string().required(),
});
