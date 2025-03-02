import express from 'express';
import { registeradmins, loginadmins, getadmins, blockandunblockadmin, Editadmin, getadminDetails } from '../controllers/authController.js';
import authHelper from '../helpers/auth.js'


const {authenticate}=authHelper


const router = express.Router();

router.post('/registeradmins',authenticate, registeradmins);
router.post('/loginadmins', loginadmins);
router.get('/getadmins',authenticate, getadmins); // Protect this route too
router.put('/block-unblock-admin/:id',authenticate, blockandunblockadmin);
router.put('/editadmin/:id',authenticate,Editadmin)
router.get("/getadmindetails",authenticate,getadminDetails)
export default router;
