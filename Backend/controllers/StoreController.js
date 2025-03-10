import Stores from "../models/stores.js"


export const GetStorespending =async(req,res)=>{
    try {
        const storedetails = await Stores.find({status:"pending"})
        console.log(storedetails);
    } catch (error) {
        console.log(error);
        
    }
}

export const GetStores =async(req,res)=>{
    try {
        const storedetails = await Stores.find({ status: { $ne: "pending" } });
        console.log(storedetails);
    } catch (error) {
        console.log(error);
        
    }
}

export const storesblockandunblock= async(req,res)=>{
    try {
        const  storeid = req.params.id;
    
        // Find the admin in the database
        const store = await Stores.findById(storeid);
        if (!store) {
          return res.status(404).json({ error: "store not found" });
        }
    
        store.isBlocked = !store.isBlocked;
        
        await store.save();
    
        res.status(200).json({
          success: true,
          message: `store ${store.isblocked ? "Blocked" : "Unblocked"} successfully`,
          store,
        });
    
      } catch (error) {
        console.error("Error in blockandunblockstore:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
}


export const storeRejecting = async(req,res)=>{
    
    try {
        const  storeid = req.params.id;
    
        // Find the admin in the database
        const store = await Stores.findById(storeid);
        if (!store) {
          return res.status(404).json({ error: "store not found" });
        }
    
        store.status = "rejected";
        
        await store.save();
    
        res.status(200).json({
          success: true,
          message: `store rejected successfully`,
          store,
        });
    
      } catch (error) {
        console.error("Error in rejecting:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }

}

export const storeApproval = async(req,res)=>{
    
    try {
        const  storeid = req.params.id;
    
        // Find the admin in the database
        const store = await Stores.findById(storeid);
        if (!store) {
          return res.status(404).json({ error: "store not found" });
        }
    
        store.status = "approved";
        
        await store.save();
    
        res.status(200).json({
          success: true,
          message: `store approved successfully`,
          store,
        });
    
      } catch (error) {
        console.error("Error in approving:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }

}