import Users from "../models/userSchema.js";



export const userblockandunblock= async(req,res)=>{
    try {
        const  userId = req.params.id;
    
        // Find the admin in the database
        const users = await Users.findById(userId);
        if (!users) {
          return res.status(404).json({ error: "users not found" });
        }
    
        users.isBlocked = !users.isBlocked;
        
        await users.save();
    
        res.status(200).json({
          success: true,
          message: `store ${users.isBlocked ? "Blocked" : "Unblocked"} successfully`,
          users,
        });
    
      } catch (error) {
        console.error("Error in blockandunblockstore:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
}


export const GetUsers = async (req, res) => {
  try {
      const { page = 1, limit = 10 } = req.query; // Default values: page 1, 10 users per page
      const skip = (page - 1) * limit; 

      const totalUsers = await Users.countDocuments(); // Total user count
      const userdetails = await Users.find().skip(skip).limit(Number(limit));

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
