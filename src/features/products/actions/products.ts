"use server";

import { InitialFormState } from "@/types/action-type";
import {
  changeProductStatus,
  createProduct,
  updateProduct,
} from "../db/products";
import { uploadToImageKit } from "@/lib/imageKit";

export const productAction = async (
  _prevState: InitialFormState,
  formData: FormData,
) => {
  const rawData = {
    id: formData.get("product-id") as string,
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    categoryId: formData.get("category-id") as string,
    cost: formData.get("cost") as string,
    basePrice: formData.get("base-price") as string,
    price: formData.get("price") as string,
    stock: formData.get("stock") as string,
    images: formData.getAll("images") as File[],
    mainImageIndex: formData.get("main-image-index") as string,
    deletedImageIds: formData.get("deleted-image-ids") as string,
  };

  console.log("=== Product Action Debug ===");
  console.log("Raw Data:", rawData);

  const processedData = {
    ...rawData,
    cost: rawData.cost ? parseFloat(rawData.cost) : undefined,
    basePrice: rawData.basePrice ? parseFloat(rawData.basePrice) : 0,
    price: rawData.price ? parseFloat(rawData.price) : 0,
    stock: rawData.stock ? parseInt(rawData.stock) : 0,
    mainImageIndex: rawData.mainImageIndex
      ? parseInt(rawData.mainImageIndex)
      : 0,
    deletedImageIds: rawData.deletedImageIds
      ? (JSON.parse(rawData.deletedImageIds) as string[])
      : [],
  };

  console.log("Processed Data:", processedData);

  const uploadedImages = [];

  for (const imageFile of processedData.images) {
    console.log("Uploading image:", imageFile.name, imageFile.size);
    const uploadResult = await uploadToImageKit(imageFile, "product");
    console.log("Upload result:", uploadResult);
    if (uploadResult && !uploadResult.message) {
      uploadedImages.push({
        url: uploadResult.url || "",
        fileId: uploadResult.fileId || "",
      });
    }
  }

  console.log("Uploaded Images:", uploadedImages);

  const result = processedData.id
    ? await updateProduct({
        ...processedData,
        images: uploadedImages,
      })
    : await createProduct({
        ...processedData,
        images: uploadedImages,
      });

  console.log("Result from DB:", result);
  console.log("=== End Debug ===");

  // ถ้ามี result และมี message แสดงว่าเกิด error
  if (result && result.message) {
    return {
      success: false,
      message: result.message,
      errors: result.error,
    };
  }

  // ถ้าไม่มี error แสดงว่าสำเร็จ
  return {
    success: true,
    message: processedData.id
      ? "Product updated successfully"
      : "Product created successfully",
  };
};

export const deleteProductAction = async (
  _prevState: InitialFormState,
  formData: FormData,
) => {
  const id = formData.get("product-id") as string;

  const result = await changeProductStatus(id, "Inactive");

  return result && result.message
    ? {
        success: false,
        message: result.message,
      }
    : {
        success: true,
        message: "Product deleted successfully",
      };
};

export const restoreProductAction = async (
  _prevState: InitialFormState,
  formData: FormData,
) => {
  const id = formData.get("product-id") as string;

  const result = await changeProductStatus(id, "Active");

  return result && result.message
    ? {
        success: false,
        message: result.message,
      }
    : {
        success: true,
        message: "Product restored successfully",
      };
};
