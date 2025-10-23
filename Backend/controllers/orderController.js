import Order from "../models/orderSchema.js";

// ✅ Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("assignedPartner", "fullName phone");

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ success: false, message: "Failed to fetch orders", error });
  }
};

// ✅ Assign delivery partner
export const assignDeliveryPartner = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { partnerId } = req.body;
    console.log(orderId);
    console.log(partnerId);
    
    

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    order.assignedPartner = partnerId;
    order.assignedAt = new Date();
    await order.save();

    res.status(200).json({ success: true, message: "Delivery partner assigned successfully" });
    
  } catch (error) {
    res.status(500).json({ success: false, message: "Error assigning partner", error });
  }
};

// ✅ Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    order.orderStatus = status;
    if (status === "Delivered") {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }
    await order.save();

    res.status(200).json({ success: true, message: "Order status updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating status", error });
  }
};
