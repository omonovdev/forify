import Joi from 'joi';

export const createCategoryValidator = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        description: Joi.string().max(255).optional(),
        isActive: Joi.boolean()
    });

    return schema.validate(data);
};

export const updateCategoryValidator = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100),
        description: Joi.string().max(255).optional(),
        isActive: Joi.boolean()
    });

    return schema.validate(data);
};

