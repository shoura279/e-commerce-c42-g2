import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.js";
import { asyncHandler } from "../../utils/appError.js";
import { createOrder } from "./order.controller.js";

const orderRouter = Router()
orderRouter.post('/',
    isAuthenticated(),
    asyncHandler(createOrder))
export default orderRouter