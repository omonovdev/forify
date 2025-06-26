import Joi from 'joi';

export const createSalesmanValidator = (data) => {
    const schema = Joi.object({
        fullName: Joi.string().min(3).max(100).required(),
        phoneNumber: Joi.string()
            .pattern(/^\+998\d{9}$/)
            .required()
            .messages({
                'string.pattern.base': 'Phone number must be a valid Uzbekistan number (+998...)'
            }),
        gender: Joi.string().valid('male', 'female').required(),
        address: Joi.string().required(),
        isActive: Joi.boolean()
    });

    return schema.validate(data, { abortEarly: false });
};

export const updateSalesmanValidator = (data) => {
    const schema = Joi.object({
        fullName: Joi.string().min(3).max(100),
        phoneNumber: Joi.string()
            .pattern(/^\+998\d{9}$/)
            .messages({
                'string.pattern.base': 'Phone number must be a valid Uzbekistan number (+998...)'
            }),
        gender: Joi.string().valid('male', 'female'),
        address: Joi.string().optional(),
        isActive: Joi.boolean()
    });

    return schema.validate(data, { abortEarly: false });
};
