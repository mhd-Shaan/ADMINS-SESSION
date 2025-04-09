import Brands from "../models/BrandSchema.js";
import Category from "../models/CatgoerySchema.js";
import Users from "../models/userSchema.js";

export const userblockandunblock = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find the admin in the database
    const users = await Users.findById(userId);
    if (!users) {
      return res.status(404).json({ error: "users not found" });
    }

    users.isBlocked = !users.isBlocked;

    await users.save();

    res.status(200).json({
      success: true,
      message: `store ${
        users.isBlocked ? "Blocked" : "Unblocked"
      } successfully`,
      users,
    });
  } catch (error) {
    console.error("Error in blockandunblockstore:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const GetUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", status = "all" } = req.query; // Default values: page 1, 10 users per page
    const skip = (page - 1) * limit;
    console.log(status);

    const searchFilter = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };

    if (status === "blocked") {
      searchFilter.isBlocked = true;
    } else if (status === "unblocked") {
      searchFilter.isBlocked = false;
    }

    const totalUsers = await Users.countDocuments(searchFilter); // Total user count
    const userdetails = await Users.find(searchFilter)
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      userdetails,
      currentPage: Number(page),
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
    });
  } catch (error) {
    console.error("Error in getusers:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const AddCatgorey = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) return res.status(400).json({ error: "Name is required" });

    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const imageUrl = req.file.path;

    const category = await Category.create({
      name,
      image: imageUrl,
    });

    return res.status(201).json({
      message: "Category added successfully",
      category,
    });
  } catch (error) {
    console.error("Error adding category:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const AddBrand = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) return res.status(400).json({ error: "Name is required" });

    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const imageUrl = req.file.path;

    const brand = await Brands.create({
      name,
      image: imageUrl,
    });

    return res.status(201).json({
      message: "Brand added successfully",
      brand,
    });
  } catch (error) {
    console.error("Error adding brand:", error);
    return res.status(500).json({ error });
  }
};

// View all brands
export const viewBrands = async (req, res) => {
  try {
    const brands = await Brands.find();
    return res.status(200).json({ brands });
  } catch (error) {
    console.error("Error fetching brands:", error);
    return res.status(500).json({ error: "Error fetching brands" });
  }
};

// View all categories
export const viewCategory = async (req, res) => {
  try {
    const category = await Category.find();
    return res.status(200).json({ category });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({ error: "Error fetching categories" });
  }
};

export const categoryblockandunblock = async (req, res) => {
  try {
    const categoryid = req.params.id;
    console.log(categoryid);
    

    const category = await Category.findById(categoryid);
    if (!category) {
      return res.status(404).json({ error: "category not found" });
    }

    category.isBlocked = !category.isBlocked;

    await category.save();

    res.status(200).json({
      success: true,
      message: `store ${
        category.isBlocked ? "Blocked" : "Unblocked"
      } successfully`,
      category,
    });
  } catch (error) {
    console.error("Error in categoryblockandunblock:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const brandsblockandunblock = async (req, res) => {
  try {
    const brandid = req.params.id;

    const brand = await Brands.findById(brandid);
    if (!brand) {
      return res.status(404).json({ error: "category not found" });
    }

    brand.isBlocked = !brand.isBlocked;

    await brand.save();

    res.status(200).json({
      success: true,
      message: `store ${
        brand.isBlocked ? "Blocked" : "Unblocked"
      } successfully`,
      brand,
    });
  } catch (error) {
    console.error("Error in brandsblockandunblock:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
