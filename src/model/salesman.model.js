import { Schema, model } from 'mongoose';

const SalesmanSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        unique: true,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    hiredAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

export default model('Salesman', SalesmanSchema);
