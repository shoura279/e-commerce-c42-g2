// import modules
import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const addCategoryVal = joi.object({
  name: generalFields.name.required(),
});

export const updateCategoryVal = joi.object({
  name: generalFields.name,
  categoryId: generalFields.objectId.required(),
});
export const deleteCategoryVal = joi
  .object()
  .keys({
    categoryId: generalFields.objectId.required(    ),
  })
  .required();
