import { error } from "console";
import Brands from "../models/BrandSchema.js";
import Category from "../models/CatgoerySchema.js";
import Users from "../models/userSchema.js";
import { type } from "os";

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
    const { name,type } = req.body;

    if (!name) return res.status(400).json({ error: "Name is required" });

    if(!type) return res.status(400).json({error:"type is required"})
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const imageUrl = req.file.path;

    const brand = await Brands.create({
      name,
      type,
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
    const { page = 1, limit = 10, search = '', status = 'all',type='' } = req.query;

    const skip = (page - 1) * Number(limit); 

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

    if (type === 'OES' || type === 'OEM') {
      searchFilter.type = type;
    }

    const totalBrands = await Brands.countDocuments(searchFilter);

    const brands = await Brands.find(searchFilter)
      .skip(skip)
      .limit(Number(limit));

    return res.status(200).json({
      totalBrands,
      currentPage: Number(page),
      totalPages: Math.ceil(totalBrands / Number(limit)),
      brands,
    });
  } catch (error) {
    console.error("Error fetching brands:", error);
    return res.status(500).json({ error: "Error fetching brands" });
  }
};


// View all categories
export const viewCategory = async (req, res) => {
  try {

    const { page = 1, limit = 10, search = '', status = 'all'} = req.query;

    const skip = (page - 1) * Number(limit); 

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

   
    
    const totalCategory = await Category.countDocuments(searchFilter);


    const category = await Category.find(searchFilter).skip(skip).limit(Number(limit))
    return res.status(200).json({
      totalCategory,
      currentPage:Number(page),
      totalPages:Math.ceil(totalCategory/Number(limit)),
       category 
      });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({ error: "Error fetching categories" });
  }
};

export const categoryblockandunblock = async (req, res) => {
  try {
    const categoryid = req.params.id;
    

    const category = await Category.findById(categoryid);
    if (!category) {
      return res.status(404).json({ error: "category not found" });
    }

    category.isBlocked = !category.isBlocked;

    await category.save();

    res.status(200).json({
      success: true,
      message: `catgory ${
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
      message: `brand ${
        brand.isBlocked ? "Blocked" : "Unblocked"
      } successfully`,
      brand,
    });
  } catch (error) {
    console.log("Error in brandsblockandunblock:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findByIdAndDelete(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      category,
    });
  } catch (error) {
    console.error("Error in deleteCategory:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteBrand = async (req, res) => {
  try {
    const BrandId = req.params.id;
    const Brand = await Brands.findByIdAndDelete(BrandId);

    if (!Brand) {
      return res.status(404).json({
        success: false,
        error: "Brand not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Brand deleted successfully",
      Brand,
    });
  } catch (error) {
    console.error("Error in deletebrand:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
