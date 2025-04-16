import express from 'express';
import { registeradmins, loginadmins, getadmins, blockandunblockadmin, Editadmin, getadminDetails, updatePassword, Otpsend, CheckingOtp } from '../controllers/authController.js';
import authHelper from '../helpers/auth.js'
import { GetStores, GetStorespending, storeApproval, storeRejecting, storesblockandunblock } from '../controllers/StoreController.js';
import { AddBrand, AddCatgorey, AddsubBrand, AddsubCategory, brandsblockandunblock, categoryblockandunblock, deleteBrand, deleteCategory, deleteSubBrand, deletesubCategory, EditSubBrand, EditSubCategory, GetUsers, Subbrandsblockandunblock, Subcategoryblockandunblock, userblockandunblock, viewBrands, viewCategory, viewSubBrands, viewSubCategory } from '../controllers/userController.js';
import OtpVerification from '../models/otpScehma.js';
import { SubBrand, Subcatgory, upload, uploding } from '../config/multer.js';


const {authenticate}=authHelper


const router = express.Router();

router.post('/registeradmins',authenticate, registeradmins);
router.post('/loginadmins', loginadmins);
router.get('/getadmins',authenticate, getadmins); // Protect this route too
router.put('/block-unblock-admin/:id',authenticate, blockandunblockadmin);
router.put('/editadmin/:id',authenticate,Editadmin)
router.get("/getadmindetails",authenticate,getadminDetails)
router.post('/send-otp',Otpsend)
router.post('/verify-otp',CheckingOtp)
router.post("/set-password",updatePassword)

router.get('/getstores',authenticate,GetStores)
router.get('/getstorespending',authenticate,GetStorespending)
router.put("/block-unblock-store/:id",authenticate,storesblockandunblock)
router.put('/store-rejecting/:id',authenticate,storeRejecting)
router.put('/store-approval/:id',authenticate,storeApproval)

router.put('/user-block-unblock/:id',authenticate,userblockandunblock)
router.get('/getallusers',authenticate,GetUsers)
router.post("/add-category",authenticate, upload.single("image"), AddCatgorey);
router.post("/add-brand",authenticate, uploding.single("image"), AddBrand);
router.get('/view-category',authenticate,viewCategory)
router.get('/view-brands',authenticate,viewBrands)
router.put('/category-status/:id',authenticate,categoryblockandunblock)
router.put('/brand-status/:id',authenticate,brandsblockandunblock)
router.delete('/delete-category/:id',authenticate,deleteCategory)
router.delete('/delete-brand/:id',authenticate,deleteBrand)
router.post('/add-subbrand',authenticate,SubBrand.single("image"),AddsubBrand)
router.post('/add-subcategory',authenticate,Subcatgory.single("image"),AddsubCategory)
router.get('/view-subbrands',authenticate,viewSubBrands)
router.get('/view-subcategory/:id',authenticate,viewSubCategory)
router.put('/edit-subbrand/:id',authenticate,EditSubBrand)
router.put('/edit-subcategory/:id',authenticate,Subcatgory.single('image'),EditSubCategory)
router.put('/subbrand-status/:id',authenticate,Subbrandsblockandunblock)
router.patch('/subcategory-status/:id',authenticate,Subcategoryblockandunblock)
router.delete('/delete-subcategory/:id',authenticate,deletesubCategory)
router.delete('/delete-subbrand/:id',authenticate,deleteSubBrand)






export default router;
