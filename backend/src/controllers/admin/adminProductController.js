// Danh sách sản phẩm
// Xem chi tiết sản phẩm
// Tạo sản phẩm mới
// Cập nhật sản phẩm
// Xóa sản phẩm
// Quản lí variant
// Quản lí hình ảnh sản phẩm
// Bật / tắt bán sản phẩm
// Phân loại theo category
// Phân biệt sản phẩm bán thường / custom / nước

import Product from "../../models/Product.js";
import ProductVariant from "../../models/ProductVariant.js";
import ProductImage from "../../models/ProductImage.js";
import Category from "../../models/Category.js";

// GET LIST PRODUCTS (pagination + search + filter)
export const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, keyword = "", category } = req.query;

    const query = {
      name: { $regex: keyword, $options: "i" },
    };

    if (category) query.category = category;

    const products = await Product.find(query)
      .populate("category")
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);

    res.json({
      data: products,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("getProducts error:", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// GET PRODUCT DETAIL
export const getProductDetail = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId).populate("category");
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    const variants = await ProductVariant.find({ product: productId });
    const images = await ProductImage.find({ product: productId });

    res.json({
      product,
      variants,
      images,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// CREATE PRODUCT
export const createProduct = async (req, res) => {
  try {
    const { name, description, basePrice, category, isCustomizable } = req.body;

    const categoryExist = await Category.findById(category);
    if (!categoryExist) {
      return res.status(400).json({ message: "Category không tồn tại" });
    }

    const product = await Product.create({
      name,
      description,
      basePrice,
      category,
      isCustomizable,
      status: "active",
    });

    res.status(201).json({
      message: "Tạo sản phẩm thành công",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findByIdAndUpdate(productId, req.body, {
      new: true,
    });

    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    res.json({ message: "Cập nhật sản phẩm thành công", product });
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// DELETE PRODUCT (SOFT DELETE)
export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findByIdAndUpdate(
      productId,
      { status: "inactive" },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    res.json({ message: "Đã ẩn sản phẩm" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// ADD VARIANT
export const addVariant = async (req, res) => {
  try {
    const { productId, size, serving, price } = req.body;

    const variant = await ProductVariant.create({
      product: productId,
      size,
      serving,
      price,
    });

    res.status(201).json({ message: "Thêm variant thành công", variant });
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// DELETE VARIANT
export const deleteVariant = async (req, res) => {
  try {
    const variantId = req.params.id;
    await ProductVariant.findByIdAndDelete(variantId);

    res.json({ message: "Đã xóa variant" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// ADD IMAGE
export const addProductImage = async (req, res) => {
  try {
    const { productId, imageUrl, isMain } = req.body;

    if (isMain) {
      await ProductImage.updateMany({ product: productId }, { isMain: false });
    }

    const image = await ProductImage.create({
      product: productId,
      imageUrl,
      isMain,
    });

    res.status(201).json({ message: "Thêm ảnh thành công", image });
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
