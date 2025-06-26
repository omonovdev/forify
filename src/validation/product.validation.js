import Joi from 'joi';

export const createProductValidator = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(2).max(100).required(),
        color: Joi.string().min(2).max(100).required(),
        price: Joi.number().required(),
        categoryId: Joi.string().required(),
        quantity: Joi.number().min(0).required(), 
        isActive: Joi.boolean()
    });

    return schema.validate(data);
};

export const updateProductValidator = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(2).max(100),
        color: Joi.string().min(5).max(100),
        price: Joi.number().optional(),
        categoryId: Joi.string(),
        quantity: Joi.number().min(0).optional(), 
        isActive: Joi.boolean()
    });

    return schema.validate(data);
};
