import Stores from "../models/stores.js"


export const GetStorespending =async(req,res)=>{
    try {
      const { page = 1, limit = 10 } = req.query; // Default values: page 1, 10 users per page
        const skip = (page - 1) * limit; 

        const totalStores = await Stores.countDocuments(); // Total user count
        const StoreDetails = await Stores.find().skip(skip).limit(Number(limit));

        const storedetails = await Stores.find({status:"pending"})
        if (!storedetails.length) {
          return res.status(404).json({ error: "No pending stores found" });
        }
         res.status(200).json({
          StoreDetails,
          currentPage: Number(page),
          totalPages: Math.ceil(totalStores / limit),
          totalStores,
        })
      } catch (error) {
        console.error("Error fetching pending stores:", error);
        res.status(500).json({ message: "Server error, please try again later" });

    }
}

export const GetStores =async(req,res)=>{
    try {

      const { page = 1, limit = 10 } = req.query; // Default values: page 1, 10 users per page
      const skip = (page - 1) * limit; 

      const totalStores = await Stores.countDocuments(); // Total user count
      const StoreDetails = await Stores.find().skip(skip).limit(Number(limit));

        const storedetails = await Stores.find({ status:"approved" });
        res.status(200).json({
          StoreDetails,
          currentPage: Number(page),
          totalPages: Math.ceil(totalStores / limit),
          totalStores,
        })    } catch (error) {
      console.error("Error fetching approved stores:", error);
      res.status(500).json({ message: "Server error, please try again later" });        
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
          message: `store ${store.isBlocked ? "Blocked" : "Unblocked"} successfully`,
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