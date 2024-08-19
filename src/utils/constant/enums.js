export const roles = {
    USER: "user",
    ADMIN: "admin",
    SELLER: "seller",
}
Object.freeze(roles)

export const status = {
    PENDING: "pending",
    VERIFIED: "verified",
    BLOCKED: "blocked"
}
Object.freeze(status)

export const couponTypes = {
    FIXEDAMOUNT: "fixedAmount",
    PERCETAGE: "percentage"
}
Object.freeze(couponTypes)

export const orderStatus = {
    PLACED: "placed",
    SHIPPING: "shipping",
    DELIVERED: "delivered",
    CANCELED: "canceled",
    REFUNDED: "refunded"
}