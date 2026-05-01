import { model } from "mongoose";

export default async function (fastify) {
  // Route to fetch and display all orders
  fastify.get("/", async (request, reply) => {
    try {
      // TODO: Fetch all orders and their items from the database
      fastify.log.info("Fetching all orders for admin view.");

      const orders = await fastify.models.Order.findAll({ 
        include: [
          {
            model: fastify.models.OrderItem,
            as: "items"
          },
          {
            model: fastify.models.User,
            as: "user",
            attributes: ["email"]
          }
        ]
       });
       
       const ordersData = orders.map(order => ({
        id: order.id,
        email: order.user?.email || order.email,
        status: order.status,
        createdAt: order.createdAt,
        OrderItems: order.items.map(item => ({
          sku: item.sku,
          price: item.price,
          quantity: item.quantity
        }))
      }));

      return reply.view("admin/orders.ejs", {
        title: "Manage Orders",
        currentPath: "/admin/orders",
        orders: ordersData
      });
    } catch (error) {
      request.session.set("messages", [
        {
          type: "danger",
          text: "Failed to fetch orders. Please try again later."
        }
      ]);
      fastify.log.error(error,"Error fetching orders:");
      return reply.redirect("/admin/orders");
    }
  });

  // Route to set an order as "shipped"
  fastify.get("/setshipped/:orderId", async (request, reply) => {
    const { orderId } = request.params;

    try {
      // TODO: Fetch the order by ID and update its status to "Shipped"
      fastify.log.info(`Attempting to set order ${orderId} as shipped.`);

      const order = await fastify.models.Order.findByPk(orderId);

      if (!order) {
        request.session.set("messages", [
          { type: "danger", text: `Order with ID ${orderId} not found.` }
        ]);
        return reply.redirect("/admin/orders");
      }
      
      order.status = "Shipped";
      await order.save();

      // TODO: Update the order status to "Shipped"
      fastify.log.info(`Order ${orderId} marked as shipped.`);

      request.session.set("messages", [
        { type: "success", text: `Order ${orderId} marked as shipped.` }
      ]);

      return reply.redirect("/admin/orders");
    } catch (error) {
      request.session.set("messages", [
        {
          type: "danger",
          text: "Failed to update order status. Please try again."
        }
      ]);
      fastify.log.error("Error updating order status:", error);
      return reply.redirect("/admin/orders");
    }
  });
}
