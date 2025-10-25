import DeliveryRegistration from "../models/deliveryBoySchema.js";
import Order from "../models/orderSchema.js";
// import DeliveryRegistration from "../models/deliveryBoySchema.js";

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

// export const autoAssignDelivery = async (req, res) => {
//   try {
//     const { orderId } = req.params;

//     // ✅ import getIo dynamically to avoid circular import
//     const { getIo } = await import("../Server.js");
//     const io = getIo();

//     const order = await Order.findById(orderId);
//     if (!order) return res.status(404).json({ message: "Order not found" });

//     const [lng, lat] = order.storeLocation.coordinates;

//     const nearbyPartners = await DeliveryRegistration.find({
//       isAvailable: true,
//       currentOrder: null,
//       location: {
//         $near: {
//           $geometry: { type: "Point", coordinates: [lng, lat] },
//           $maxDistance: 5000,
//         },
//       },
//     }).limit(5);

//     if (nearbyPartners.length === 0)
//       return res.status(400).json({ message: "No delivery partners nearby" });

//     console.log(`Sending offer to ${nearbyPartners.length} partners`);

//     for (const partner of nearbyPartners) {
//       io.to(partner.socketId).emit("newOrderOffer", {
//         orderId: order._id,
//         storeName: order.storeName,
//         totalAmount: order.totalAmount,
//         address: order.deliveryAddress,
//       });
//     }

//     let accepted = false;
//     const timeout = 15000;

//     const timer = setTimeout(() => {
//       if (!accepted) io.emit("offerExpired", { orderId: order._id });
//     }, timeout);

//     io.once("partnerAccepted", async ({ orderId: oId, partnerId }) => {
//       if (oId === order._id.toString() && !accepted) {
//         accepted = true;
//         clearTimeout(timer);
//         await assignOrderToPartner(order, partnerId);
//         io.emit("orderAssigned", { orderId: order._id, partnerId });
//         for (const partner of nearbyPartners) {
//           if (partner._id.toString() !== partnerId)
//             io.to(partner.socketId).emit("orderTaken", { orderId: order._id });
//         }
//       }
//     });

//     res.status(200).json({ success: true, message: "Offer sent to nearby partners" });
//   } catch (error) {
//     console.error("Auto-assign error:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// ✅ Helper
// const assignOrderToPartner = async (order, partnerId) => {
//   const partner = await DeliveryRegistration.findById(partnerId);
//   if (!partner) return;

//   order.assignedPartner = partnerId;
//   order.orderStatus = "Assigned";
//   await order.save();

//   partner.currentOrder = order._id;
//   partner.isAvailable = false;
//   await partner.save();
// };
