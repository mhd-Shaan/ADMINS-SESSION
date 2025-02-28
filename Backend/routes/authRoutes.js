import express from 'express';
import { registeradmins, loginadmins, getadmins, blockandunblockadmin, Editadmin, getadminbyid } from '../controllers/authController.js';
import authHelper from '../helpers/auth.js'


const {authenticate}=authHelper


const router = express.Router();

router.post('/registeradmins', registeradmins);
router.post('/loginadmins', loginadmins);
router.get('/getadmins', getadmins); // Protect this route too
router.put('/block-unblock-admin/:id', blockandunblockadmin);
router.put('/editadmin/:id',Editadmin)
router.get("/getadminbyid/:id",authenticate,getadminbyid)
export default router;
