// import modules
import cors from 'cors';
import dotenv from 'dotenv';
import express from "express";
import path from 'path';
import Stripe from 'stripe';
import { connectDB } from "./db/connection.js";
import { Cart, Product } from './db/index.js';
import * as allRouters from "./src/index.js";
import { globalErrorHandling } from "./src/utils/appError.js";
// import categoryRouter from './src/modules/category/category.router.js'
// import subcategoryRouter from './src/modules/subcategory/subcategory.router.js'
// import brandRouter from './src/modules/brand/brand.router.js'
// import productRouter from './src/modules/product/product.router.js'
// create server
const app = express();
const port = process.env.PORT || 3000;
// connect to db
connectDB();
// parse req
app.use(cors('*'))
dotenv.config({ path: path.resolve('./config/.env') })
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {

  // console.log("test");

  const sig = req.headers['stripe-signature'].toString();
  const stripe = new Stripe(process.env.STRIPE_KEY)
  let event;

  event = stripe.webhooks.constructEvent(req.body, sig, "whsec_e72fa9c2231c951259b2a7f9f2a2da8b2490627802ba47934339301e2067b3d8");

  if (event.type == 'checkout.session.completed') {

    console.log(event);

    const object = event.data.object;
    // logic
    // cart
    console.log(object.client_reference_id);

    const cart = await Cart.findById(object.client_reference_id)
    for (const product of cart.products) {
      await Product.findByIdAndUpdate(product.productId, { $set: { $inc: { stock: -product.quantity } } })
    }
    cart.products = []
    await cart.save()
  }
  // Return a 200 res to acknowledge receipt of the event
  res.send();
});
app.use(express.json());
app.use("/category", allRouters.categoryRouter);
app.use("/sub-category", allRouters.subcategoryRouter);
app.use("/brand", allRouters.brandRouter);
app.use("/product", allRouters.productRouter);
app.use('/auth', allRouters.authRouter)
app.use('/review', allRouters.reviewRouter)
app.use('/wishlist', allRouters.wishlistRouter)
app.use('/cart', allRouters.cartRouter)
app.use('/coupon', allRouters.couponRouter)
app.use('/order', allRouters.orderRouter)
app.use('/', (req, res, next) => { return res.json({ message: 'invalid url' }) })
// global error
app.use(globalErrorHandling);
// listen server
app.listen(port, () => {
  console.log("server is running on port", port);
});
