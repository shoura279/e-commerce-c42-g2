import { model, Schema } from "mongoose";

// schema
const brandSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    logo: Object//{secure_url,public_id}
}, {
    timestamps: true
})
// model
export const Brand = model('Brand', brandSchema)