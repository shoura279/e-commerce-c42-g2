// import modules
import cors from 'cors';
import dotenv from 'dotenv';
import express from "express";
import path from 'path';
import Stripe from 'stripe';
import { connectDB } from "./db/connection.js";
import { Cart, Order, Product } from './db/index.js';
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
  const stripe = new Stripe('sk_test_51PpaGLP829c5C7AK3uaBUMuIUEqLECKIbtbwqDVIX1LLcgYMPE2y5cuyvERhjKYdHs5eJgEnGp5UNn6IcLB5Ku9B00tygmYZpK')
  let event;

  event = stripe.webhooks.constructEvent(req.body, sig, "whsec_6Suv2cPBZYLsO8LA6BGCIz7gvKVg2o9x");

  if (event.type == 'checkout.session.completed') {

    console.log(event);

    const object = event.data.object;
    // logic
    // cart
    console.log(object.client_reference_id);

    const order = await Order.findById(object.metadata.orderID)
    for (const product of order.products) {
      await Product.findByIdAndUpdate(product.productId, { $inc: { stock: -product.quantity }  })
    }
    await Cart.findOneAndUpdate({ user: order.user }, { products: [] })
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
