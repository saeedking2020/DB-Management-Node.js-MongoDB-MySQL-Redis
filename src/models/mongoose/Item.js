import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
    {
        sku: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        tags: { type: [String], default: [] }
    },
    { timestamps: true }
);

itemSchema.index({tags: 1});//1 is for ascending order, -1 is for descending order
itemSchema.index({name: 1});//1 is for ascending order, -1 is for descending order
itemSchema.index({name: "text"});//text index for full-text search on the name field

export const Item = mongoose.model('Item', itemSchema);