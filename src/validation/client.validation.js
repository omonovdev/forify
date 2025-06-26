import Joi from 'joi';

// ✅ Telefon raqam uchun pattern (O'zbekiston formati)
const phonePattern = /^\+998\d{9}$/;

// ✅ CREATE validator
export const createClientValidator = (data) => {
    const schema = Joi.object({
        fullName: Joi.string().min(3).max(100).required(),
        phoneNumber: Joi.string().pattern(phonePattern).required(),
        gender: Joi.string().valid('male', 'female').required(),
        address: Joi.string().max(255).allow('', null),
        isActive: Joi.boolean()
    });

    return schema.validate(data, { abortEarly: false });
};

// ✅ UPDATE validator
export const updateClientValidator = (data) => {
    const schema = Joi.object({
        fullName: Joi.string().min(3).max(100),
        phoneNumber: Joi.string().pattern(phonePattern),
        gender: Joi.string().valid('male', 'female'),
        address: Joi.string().max(255).allow('', null),
        isActive: Joi.boolean()
    });

    return schema.validate(data, { abortEarly: false });
};
