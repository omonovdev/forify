import Category from '../model/category.model.js';
import { isValidObjectId } from 'mongoose';
import { resError } from '../helpers/resError.js';
import { resSuccses } from '../helpers/resSuccess.js';
import {
    createCategoryValidator,
    updateCategoryValidator
} from '../validation/category.validation.js';
import Product from '../model/product.model.js';

export class categoryController {

    async createCategory(req, res) {
        try {
            const { value, error } = createCategoryValidator(req.body);
            if (error) return resError(res, error, 422);

            const exists = await Category.findOne({ name: value.name });
            if (exists) return resError(res, 'Category name already exists', 409);

            const category = await Category.create(value);
            return resSuccses(res, category, 201);
        } catch (error) {
            return resError(res, error);
        }
    }

    async getAllCategories(req, res) {
        try {
            const categories = await Category.find();
            return resSuccses(res, categories);
        } catch (error) {
            return resError(res, error);
        }
    }
async getCategoryById(req, res) {
    try {
        const category = await categoryController.findCategoryById(res, req.params.id);

        const products = await Product.find({ categoryId: category._id });

        return resSuccses(res, {
            category,
            products
        });

    } catch (error) {
        return resError(res, error);
    }
}


    async updateCategoryById(req, res) {
        try {
            const id = req.params.id;
            await categoryController.findCategoryById(res, id);

            const { value, error } = updateCategoryValidator(req.body);
            if (error) return resError(res, error, 422);

            const updated = await Category.findByIdAndUpdate(id, value, { new: true });
            return resSuccses(res, updated);
        } catch (error) {
            return resError(res, error);
        }
    }

async deleteCategoryById(req, res) {
    try {
        const id = req.params.id;
        await categoryController.findCategoryById(res, id);
        await Product.deleteMany({ categoryId: id });
        await Category.findByIdAndDelete(id);
        return resSuccses(res, { message: 'Category and its products deleted' });
    } catch (error) {
        return resError(res, error);
    }
}


    static async findCategoryById(res, id) {
        if (!isValidObjectId(id)) return resError(res, 'Invalid ID format', 400);

        const category = await Category.findById(id);
        if (!category) return resError(res, 'Category not found', 404);

        return category;
    }
}
