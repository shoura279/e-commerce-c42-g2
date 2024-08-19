import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enums.js";
import { asyncHandler } from "../../utils/appError.js";
import { addToWishlist, deleteFromWishlist, getWishlist } from "./wishlist.controller.js";
const wishlistRouter = Router()

// add to wishlist
wishlistRouter.post('/',
    isAuthenticated(),
    isAuthorized([roles.USER]),
    asyncHandler(addToWishlist)
)

wishlistRouter.get('/',
    isAuthenticated(),
    isAuthorized([roles.USER]),
    asyncHandler(getWishlist)
)

wishlistRouter.delete('/:productId',
    isAuthenticated(),
    isAuthorized([roles.USER]),
    asyncHandler(deleteFromWishlist)
)
export default wishlistRouter