import Joi from 'joi';

export const createSoldValidator = (data) => {
    const schema = Joi.object({
        productId: Joi.string().required(),
        clientId: Joi.string().required(),
        salesmanId: Joi.string().required(),
        quantity: Joi.number().integer().min(1).required()
    });

    return schema.validate(data, { abortEarly: false });
};

export const updateSoldValidator = (data) => {
    const schema = Joi.object({
        productId: Joi.string(),
        clientId: Joi.string(),
        salesmanId: Joi.string(),
        quantity: Joi.number().integer().min(1)
    });

    return schema.validate(data, { abortEarly: false });
};
