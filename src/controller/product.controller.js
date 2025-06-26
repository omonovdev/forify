import Product from '../model/product.model.js';
import { isValidObjectId } from 'mongoose';
import { resError } from '../helpers/resError.js';
import { resSuccses } from '../helpers/resSuccess.js';
import {
    createProductValidator,
    updateProductValidator
} from '../validation/product.validation.js';

export class productController {

    async createProduct(req, res) {
        try {
            const { value, error } = createProductValidator(req.body);
            if (error) return resError(res, error, 422);

            const product = await Product.create(value);
            return resSuccses(res, product, 201);
        } catch (error) {
            return resError(res, error);
        }
    }

    async getAllProducts(req, res) {
        try {
            const products = await Product.find().populate('categoryId');
            return resSuccses(res, products);
        } catch (error) {
            return resError(res, error);
        }
    }

    async getProductById(req, res) {
        try {
            const product = await productController.findById(res, req.params.id);
            return resSuccses(res, product);
        } catch (error) {
            return resError(res, error);
        }
    }

    async updateProductById(req, res) {
        try {
            const id = req.params.id;
            await productController.findById(res, id);

            const { value, error } = updateProductValidator(req.body);
            if (error) return resError(res, error, 422);

            const updated = await Product.findByIdAndUpdate(id, value, { new: true });
            return resSuccses(res, updated);
        } catch (error) {
            return resError(res, error);
        }
    }

    async deleteProductById(req, res) {
        try {
            const id = req.params.id;
            await productController.findById(res, id);

            await Product.findByIdAndDelete(id);
            return resSuccses(res, { message: 'Product deleted' });
        } catch (error) {
            return resError(res, error);
        }
    }

    static async findById(res, id) {
        if (!isValidObjectId(id)) return resError(res, 'Invalid ID format', 400);

        const product = await Product.findById(id).populate('categoryId');
        if (!product) return resError(res, 'Product not found', 404);

        return product;
    }
}
