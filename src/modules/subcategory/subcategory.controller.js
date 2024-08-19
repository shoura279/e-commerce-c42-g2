import slugify from "slugify";
import axios from "axios";
import { Category } from "../../../db/models/category.model.js";
import { Subcategory } from "../../../db/models/subcategory.model.js";
import { AppError } from "../../utils/appError.js";
import { messages } from "../../utils/constant/messages.js";

// add subcategory
export const addSubcategory = async (req, res, next) => {
  // get data from req
  const { name, category } = req.body;
  // check file
  if (!req.file) {
    return next(new AppError(messages.file.required, 400));
  }
  // check existence
  const categoryExist = await Category.findById(category); // {},null
  if (!categoryExist) {
    return next(new AppError(messages.category.notFound, 404));
  }
  // check name existence
  const nameExist = await Subcategory.findOne({ name, category }); // {},null
  if (nameExist) {
    return next(new AppError(messages.subcategory.alreadyExist, 409));
  }
  // prepare data
  const slug = slugify(name);
  const subcategory = new Subcategory({
    name,
    slug,
    category,
    image: { path: req.file.path },
  });
  // add to db
  const createdSubcategory = await subcategory.save();
  if (!createdSubcategory) {
    return next(new AppError(messages.subcategory.failToCreate, 500));
  }
  // send response
  return res.status(201).json({
    message: messages.subcategory.createdSuccessfully,
    success: true,
    data: createdSubcategory,
  });
};

export const getSubcategory = async (req, res, next) => {
  // // get data from req
  // const { categoryId } = req.params
  // const subcategories = await Subcategory.find({ category: categoryId }).populate([{ path: "category" }])// [{}],[]
  // return res.status(200).json({ success: true, data: subcategories, })
  //   axios({
  //     url: `${req.protocol}://${req.headers.host}/category/${req.params.categoryId}`,
  //     method: "GET",
  //   }).then((response) => {
  //     return res
  //       .status(response.status)
  //       .json({ message: response.data.message, success: response.data.success });
  //   });
};
