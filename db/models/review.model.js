import { model, Schema } from "mongoose";

// schema
const reviewSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        comment: String,
        rate: {
            type: Number,
            max: 5,
            min: 0
        }
    }, { timestamps: true })
// model
export const Review = model('Review', reviewSchema)
