import Client from '../model/client.model.js';
import { isValidObjectId } from 'mongoose';
import { resError } from '../helpers/resError.js';
import { resSuccses } from '../helpers/resSuccess.js';
import {
    createClientValidator,
    updateClientValidator
} from '../validation/client.validation.js';

export class clientController {
    
    async createClient(req, res) {
        try {
            const { value, error } = createClientValidator(req.body);
            if (error) return resError(res, error, 422);

            const exists = await Client.findOne({ phoneNumber: value.phoneNumber });
            if (exists) return resError(res, 'Phone number already exists', 409);

            const client = await Client.create(value);
            return resSuccses(res, client, 201);
        } catch (error) {
            return resError(res, error);
        }
    }

    async getAllClients(req, res) {
        try {
            const clients = await Client.find();
            return resSuccses(res, clients);
        } catch (error) {
            return resError(res, error);
        }
    }

    async getClientById(req, res) {
        try {
            const client = await clientController.findClientById(res, req.params.id);
            return resSuccses(res, client);
        } catch (error) {
            return resError(res, error);
        }
    }

    async updateClientById(req, res) {
        try {
            const id = req.params.id;
            await clientController.findClientById(res, id);

            const { value, error } = updateClientValidator(req.body);
            if (error) return resError(res, error, 422);

            const updated = await Client.findByIdAndUpdate(id, value, { new: true });
            return resSuccses(res, updated);
        } catch (error) {
            return resError(res, error);
        }
    }

    async deleteClientById(req, res) {
        try {
            const id = req.params.id;
            await clientController.findClientById(res, id);

            await Client.findByIdAndDelete(id);
            return resSuccses(res, { message: 'Client deleted' });
        } catch (error) {
            return resError(res, error);
        }
    }

    static async findClientById(res, id) {
        if (!isValidObjectId(id)) return resError(res, 'Invalid ID format', 400);

        const client = await Client.findById(id);
        if (!client) return resError(res, 'Client not found', 404);

        return client;
    }
}
