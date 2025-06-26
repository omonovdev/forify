import { Schema, model } from 'mongoose';

const SoldProductSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    salesmanId: {
        type: Schema.Types.ObjectId,
        ref: 'Salesman',
        required: true
    },
     clientId: {
        type: Schema.Types.ObjectId,
        ref: 'Client', 
        required: true
    },

    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    totalPrice: {
        type: Number,
        required: true
    },
    soldAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

export default model('SoldProduct', SoldProductSchema);
