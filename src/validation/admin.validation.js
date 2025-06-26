import Joi from 'joi';

const passwordPattern = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@!#%*?&.,/-])[A-Za-z\d$@!#%*?&.,/-]{5,20}/;

export const createvalidator = (data) => Joi.object({
    username: Joi.string().min(4).required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().required(),
    password: Joi.string().pattern(passwordPattern).required()
}).validate(data);

export const updateValidator = (data) => Joi.object({
    username: Joi.string().min(4),
    email: Joi.string().email(),
    phoneNumber: Joi.string(),
    password: Joi.string().pattern(passwordPattern)
}).validate(data);

export const signInAdminvalidator = (data) => Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
}).validate(data);
