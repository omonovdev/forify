import Salesman from '../model/salesman.model.js';
import { isValidObjectId } from 'mongoose';
import { resError } from '../helpers/resError.js';
import { resSuccses } from '../helpers/resSuccess.js';
import {
    createSalesmanValidator,
    updateSalesmanValidator
} from '../validation/salesman.validation.js';

export class salesmanController {

    async createSalesman(req, res) {
        try {
            const { value, error } = createSalesmanValidator(req.body);
            if (error) return resError(res, error, 422);

            const exists = await Salesman.findOne({ phoneNumber: value.phoneNumber });
            if (exists) return resError(res, 'Phone number already exists', 409);

            const salesman = await Salesman.create(value);
            return resSuccses(res, salesman, 201);
        } catch (error) {
            return resError(res, error);
        }
    }

    async getAllSalesmen(req, res) {
        try {
            const salesmen = await Salesman.find();
            return resSuccses(res, salesmen);
        } catch (error) {
            return resError(res, error);
        }
    }

    async getSalesmanById(req, res) {
        try {
            const salesman = await salesmanController.findById(res, req.params.id);
            return resSuccses(res, salesman);
        } catch (error) {
            return resError(res, error);
        }
    }

    async updateSalesmanById(req, res) {
        try {
            const id = req.params.id;
            await salesmanController.findById(res, id);

            const { value, error } = updateSalesmanValidator(req.body);
            if (error) return resError(res, error, 422);

            const updated = await Salesman.findByIdAndUpdate(id, value, { new: true });
            return resSuccses(res, updated);
        } catch (error) {
            return resError(res, error);
        }
    }
    async deleteSalesmanById(req, res) {
        try {
            const id = req.params.id;
            await salesmanController.findById(res, id);

            await Salesman.findByIdAndDelete(id);
            return resSuccses(res, { message: 'Salesman deleted' });
        } catch (error) {
            return resError(res, error);
        }
    }

    static async findById(res, id) {
        if (!isValidObjectId(id)) return resError(res, 'Invalid ID format', 400);

        const salesman = await Salesman.findById(id);
        if (!salesman) return resError(res, 'Salesman not found', 404);

        return salesman;
    }
}
