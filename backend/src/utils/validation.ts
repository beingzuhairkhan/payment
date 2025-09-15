import Joi from "joi";

export const userRegisterValidation = Joi.object({
    name:Joi.string().min(3).max(30).required(),
    email:Joi.string().email().required(),
    password:Joi.string().min(6).required()
})

export const userLoginValidation = Joi.object({
    email:Joi.string().email().required(),
    password:Joi.string().min(6).required()
})


export const createPaymentValidation = Joi.object({
  school_id: Joi.string(),
  trustee_id: Joi.string(),
  student_info: Joi.object({
    name: Joi.string().required(),
    id: Joi.string().required(),
    email: Joi.string().email().required(),
  }).required(),
  gateway_name: Joi.string().valid("NetBanking").required(),
  custom_order_id: Joi.string().optional(),
  order_amount: Joi.number().min(0).required()
});


export const createSchoolValidation = Joi.object({
    name:Joi.string().required(),
    email:Joi.string().email().required()
})