import { error, log } from "console";
import Brands from "../models/BrandSchema.js";
import Category from "../models/CatgoerySchema.js";
import Users from "../models/userSchema.js";
import { type } from "os";
import SubBrands from "../models/SubBrandSchema.js";
import SubCategory from "../models/SubCatgoerySchema.js";
import mongoose from 'mongoose';
import LocationSchema from "../models/LocationSchema.js";
import Location from "../models/LocationSchema.js";
import DeliveryRegistration from "../models/deliveryBoySchema.js.js";


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
    const { page = 1, limit, search = '', status = 'all' } = req.query;

    const searchFilter = {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ],
    };

    if (status === 'blocked') {
      searchFilter.isBlocked = true;
    } else if (status === 'unblocked') {
      searchFilter.isBlocked = false;
    }

    const totalCategory = await Category.countDocuments(searchFilter);

    let query = Category.find(searchFilter);

    // If limit is provided, apply pagination
    if (limit) {
      const skip = (page - 1) * Number(limit);
      query = query.skip(skip).limit(Number(limit));
    }

    const category = await query;

    return res.status(200).json({
      totalCategory,
      currentPage: Number(page),
      totalPages: limit ? Math.ceil(totalCategory / Number(limit)) : 1,
      category,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({ error: 'Error fetching categories' });
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


export const AddsubBrand = async (req, res) => {
  try {
    const { name,type } = req.body;
    const BrandId = req.params.id;

    if (!name) return res.status(400).json({ error: "Name is required" });

    if(!type) return res.status(400).json({error:"type is required"})
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const imageUrl = req.file.path;

    const brand = await SubBrands.create({
      BrandId,
      name,
      type,
      image: imageUrl,
    });

    return res.status(201).json({
      message: "subBrand added successfully",
      brand,
    });
  } catch (error) {
    console.error("Error adding sub brand:", error);
    return res.status(500).json({ error });
  }
};


export const AddsubCategory = async (req, res) => {
  try {
    const { name,type,categoryId } = req.body;
    
    

    if (!name) return res.status(400).json({ error: "Name is required" });

    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const imageUrl = req.file.path;

    const brand = await SubCategory.create({
      CategoryId: categoryId,
      name,
      type,
      image: imageUrl,
    });
    

    return res.status(201).json({
      message: "subCategory added successfully",
      brand,
    });
  } catch (error) {
    console.error("Error adding sub Category:", error);
    return res.status(500).json({ error });
  }
};


export const deletesubCategory = async (req, res) => {
  try {
    const subcategoryId = req.params.id;
    const subcategory = await SubCategory.findByIdAndDelete(subcategoryId);

    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "subCategory deleted successfully",
      subcategory,
    });
  } catch (error) {
    console.error("Error in deletesubCategory:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const deleteSubBrand = async (req, res) => {
  try {
    const subBrandId = req.params.id;
    const SubBrand = await SubBrands.findByIdAndDelete(subBrandId);

    if (!SubBrand) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "subBrand deleted successfully",
      SubBrand,
    });
  } catch (error) {
    console.error("Error in deletesubBrand:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



export const EditSubBrand = async (req, res) => {
  try {
    const subBrandId = req.params.id;
    const { name } = req.body;

    if (!name) return res.status(400).json({ error: "Name is required" });
    if (!req.file) return res.status(400).json({ error: "No image uploaded" });

    // Find sub-brand in database
    const subBrand = await SubBrands.findById(subBrandId); // Use your actual model here
    if (!subBrand) {
      return res
        .status(404)
        .json({ success: false, message: "Sub-brand not found" });
    }

    // Update values
    subBrand.name = name;
    subBrand.image = req.file.path; // Cloudinary URL

    await subBrand.save();

    res.status(200).json({
      success: true,
      message: "Sub-brand updated successfully",
      subBrand,
    });
  } catch (error) {
    console.error("Error updating SubBrand:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


export const EditSubCategory = async (req, res) => {
  try {
    const subCategoryId = req.params.id;
    
    const { name } = req.body;
    

    if (!name) return res.status(400).json({ error: "Name is required" });

    const subCategory = await SubCategory.findById(subCategoryId);
    if (!subCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Subcategory not found" });
    }

    subCategory.name = name;

    if (req.file) {
      subCategory.image = req.file.path;
    }

    await subCategory.save();

    res.status(200).json({
      success: true,
      message: "Subcategory updated successfully",
      subCategory,
    });
  } catch (error) {
    console.error("Error updating Subcategory:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



export const Subbrandsblockandunblock = async (req, res) => {
  try {
    const Subbrandid = req.params.id;

    const brand = await SubBrands.findById(Subbrandid);
    if (!brand) {
      return res.status(404).json({ error: "category not found" });
    }

    brand.isBlocked = !brand.isBlocked;

    await brand.save();

    res.status(200).json({
      success: true,
      message: `Subbrand ${
        brand.isBlocked ? "Blocked" : "Unblocked"
      } successfully`,
      brand,
    });
  } catch (error) {
    console.log("Error in Subbrandsblockandunblock:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const Subcategoryblockandunblock = async (req, res) => {
  try {
    const Subcategoryid = req.params.id;
    
    

    const category = await SubCategory.findById(Subcategoryid);
    if (!category) {
      return res.status(404).json({ error: "category not found" });
    }

    category.isBlocked = !category.isBlocked;

    await category.save();

    res.status(200).json({
      success: true,
      message: `Subcatgory ${
        category.isBlocked ? "Blocked" : "Unblocked"
      } successfully`,
      category,
    });
  } catch (error) {
    console.error("Error in Subcategoryblockandunblock:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const viewSubBrands = async (req,res)=>{
  try {
    const brandId = req.params.id

    const subbrands = await SubBrands.find({brandId})

    res.status(200).json({
      subbrands,
    });
  } catch (error) {
    console.log('error in viewsubbrand',error);
    res.status(500).json({ error });
  }
};


export const viewSubCategory = async (req, res) => {
  try {
    const categoryId = new mongoose.Types.ObjectId(req.params.id);
    const { page = 1, limit = 10, search = '', status = 'all' } = req.query;

    const skip = (page - 1) * Number(limit);

    const query = { CategoryId: categoryId };

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (status === 'blocked') {
      query.isBlocked = true;
    } else if (status === 'unblocked') {
      query.isBlocked = false;
    }

    const totalCount = await SubCategory.countDocuments(query);
    
    const subcategories = await SubCategory.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });


    return res.status(200).json({
      success: true,
      subcategory: subcategories,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};



export const managelocation = async(req,res)=>{
  try {
    const { city,isActive } = req.body;
    
  
    if (!city) return res.status(400).json({ error: "city is required" });
    if (!isActive) return res.status(400).json({ error: "status is required" });

    const existlocation = await Location.findOne({city})

    if(existlocation) return res.status(400).json({error:"this is already existing"})
    const location = await Location.create({
     city,
    isActive
    });
    

    return res.status(201).json({
      message: "city added successfully",
      location,
    });


  } catch (error) {
    console.log(error);
    return res.status(500).json({ error});
  }
}

export const viewlocation = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = 'all' } = req.query;
    const skip = (page - 1) * Number(limit);

    const query = {};

    if (search) {
      query.city = { $regex: search, $options: 'i' };  
    }

    if (status === 'blocked') {
      query.isActive = false;
    } else if (status === 'unblocked') {
      query.isActive = true;
    }

    const totalCount = await Location.countDocuments(query);

    const cities = await Location.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    return res.status(200).json({
      cities,
      totalPages: Math.ceil(totalCount / limit),
      totalCount
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while fetching cities.' });
  }
};


export const locationblockandunblock = async (req, res) => {
  try {
    const locationid = req.params.id;

    const city = await Location.findById(locationid);
    if (!city) {
      return res.status(404).json({ error: "Location not found" });
    }

    
    city.isActive = !city.isActive;


    res.status(200).json({
      success: true,
      message: `Location ${
        city.isActive ? "Unblocked" : "Blocked"
      } successfully`,
      city,
    });
    await city.save();

  } catch (error) {
    console.error("Error in blocking/unblocking location:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



export const deletelocations = async (req, res) => {
  try {
    const locationId = req.params.id;
    const citys = await Location.findByIdAndDelete(locationId);

    if (!citys) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "city deleted successfully",
      citys,
    });
  } catch (error) {
    console.log("Error in deletecitys:", error);
    res.status(500).json({ error });
  }
};

export const viewboys = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = '', status = 'all' } = req.query;
    
    

    const pageNum = Math.max(Number(page), 1);
    const limitNum = Math.max(Number(limit), 1);
    const skip = (pageNum - 1) * limitNum;

    const query = {};

    if (search) {
      query.fullName = { $regex: search, $options: 'i' };
    }

    if (status === 'blocked') {
      query.isBlocked = true;
    } else if (status === 'unblocked') {
      query.isBlocked = false;
    }
    

    const totalCount = await DeliveryRegistration.countDocuments(query);

    const deliveryBoys = await DeliveryRegistration.find(query)
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      deliveryBoys,
      totalPages: Math.ceil(totalCount / limitNum),
      totalCount,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const boysblockandunblock = async (req, res) => {
  try {
    
    const boysid = req.params.id;

    // Find the admin in the database
    const boys = await DeliveryRegistration.findById(boysid);
    
    if (!boys) {
      return res.status(404).json({ error: "boys not found" });
    }

    boys.isBlocked = !boys.isBlocked;

    await boys.save();

    res.status(200).json({
      success: true,
      message: `boys ${
        boys.isBlocked ? "Blocked" : "Unblocked"
      } successfully`,
      boys,
    });
  } catch (error) {
    console.error("Error in blockandunblockboys:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
