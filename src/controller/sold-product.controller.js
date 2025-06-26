import SoldProduct from '../model/sold-product.model.js';
import Product from '../model/product.model.js';
import { isValidObjectId } from 'mongoose';
import { resError } from '../helpers/resError.js';
import { resSuccses } from '../helpers/resSuccess.js';
import {
    createSoldValidator,
    updateSoldValidator
} from '../validation/sold-product.validation.js';

export class soldProductController {
async createSold(req, res) {
    try {
        const { value, error } = createSoldValidator(req.body);
        if (error) return resError(res, error, 422);

        const product = await Product.findById(value.productId);
        if (!product) return resError(res, 'Product not found', 404);

        if (product.quantity < value.quantity) {
            return resError(res, 'Yetarli mahsulot yo‘q', 400);
        }

        const totalPrice = value.quantity * product.price;

        const sold = await SoldProduct.create({
            ...value,
            totalPrice
        });

    
        product.quantity -= value.quantity;
        await product.save();

        return resSuccses(res, sold, 201);
    } catch (error) {
        return resError(res, error);
    }
}


    async getAllSold(req, res) {
        try {
            const solds = await SoldProduct.find()
                .populate('productId')
                .populate('salesmanId');
            return resSuccses(res, solds);
        } catch (error) {
            return resError(res, error);
        }
    }

    async getSoldById(req, res) {
        try {
            const sold = await soldProductController.findById(req.params.id, res);
            return resSuccses(res, sold);
        } catch (error) {
            return resError(res, error);
        }
    }

    async updateSoldById(req, res) {
        try {
            const id = req.params.id;
            const { value, error } = updateSoldValidator(req.body);
            if (error) return resError(res, error, 422);

            const oldData = await soldProductController.findById(id, res);

            let totalPrice = oldData.totalPrice;

            if (value.productId || value.quantity) {
                const product = await Product.findById(value.productId || oldData.productId);
                if (!product) return resError(res, 'Product not found', 404);
                totalPrice = (value.quantity || oldData.quantity) * product.price;
            }

            const updated = await SoldProduct.findByIdAndUpdate(
                id,
                { ...value, totalPrice },
                { new: true }
            );

            return resSuccses(res, updated);
        } catch (error) {
            return resError(res, error);
        }
    }

    async deleteSoldById(req, res) {
        try {
            await soldProductController.findById(req.params.id, res);
            await SoldProduct.findByIdAndDelete(req.params.id);
            return resSuccses(res, { message: 'Sold product deleted' });
        } catch (error) {
            return resError(res, error);
        }
    }

    static async findById(id, res) {
        if (!isValidObjectId(id)) return resError(res, 'Invalid ID', 400);

        const sold = await SoldProduct.findById(id)
            .populate('productId')
            .populate('salesmanId');

        if (!sold) return resError(res, 'Sold product not found', 404);
        return sold;
    }
}
