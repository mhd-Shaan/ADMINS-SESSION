import express from 'express';
import { registeradmins, loginadmins, getadmins, blockandunblockadmin, Editadmin, getadminDetails } from '../controllers/authController.js';
import authHelper from '../helpers/auth.js'
import { GetStores, GetStorespending, storeApproval, storeRejecting, storesblockandunblock } from '../controllers/StoreController.js';
import { GetUsers, userblockandunblock } from '../controllers/userController.js';


const {authenticate}=authHelper


const router = express.Router();

router.post('/registeradmins',authenticate, registeradmins);
router.post('/loginadmins', loginadmins);
router.get('/getadmins',authenticate, getadmins); // Protect this route too
router.put('/block-unblock-admin/:id',authenticate, blockandunblockadmin);
router.put('/editadmin/:id',authenticate,Editadmin)
router.get("/getadmindetails",authenticate,getadminDetails)

router.get('/getstores',authenticate,GetStores)
router.get('/getstorespending',authenticate,GetStorespending)
router.put("/block-unblock-store/:id",authenticate,storesblockandunblock)
router.put('/store-rejecting/:id',authenticate,storeRejecting)
router.put('/store-approval/:id',authenticate,storeApproval)

router.put('/user-block-unblock/:id',authenticate,userblockandunblock)
router.get('/getallusers',authenticate,GetUsers)
export default router;
