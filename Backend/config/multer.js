import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinaryConfig.js";

// Cloudinary storage setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: "Catgoery",
    format: file.mimetype.split("/")[1], // Auto-detect format
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  }),
});

// Multer upload instance (allows multiple images)
export const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size (5MB)
});



const storageBrands = new CloudinaryStorage({
  cloudinary: cloudinary,

  params: async (req, file) => ({
    folder: "Brands",
    format: file.mimetype.split("/")[1], // Auto-detect format
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  }),
});

// Multer upload instance (allows multiple images)
export const uploding = multer({
  storage: storageBrands,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size (5MB)
});




const storageSubBrands = new CloudinaryStorage({
  cloudinary: cloudinary,

  params: async (req, file) => ({
    folder: "SubBrands",
    format: file.mimetype.split("/")[1], // Auto-detect format
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  }),
});

// Multer upload instance (allows multiple images)
export const SubBrand = multer({
  storage: storageSubBrands,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size (5MB)
});



const SubCategorystorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: "Catgoery",
    format: file.mimetype.split("/")[1], // Auto-detect format
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  }),
});

// Multer upload instance (allows multiple images)
export const Subcatgory = multer({
  storage: SubCategorystorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size (5MB)
});