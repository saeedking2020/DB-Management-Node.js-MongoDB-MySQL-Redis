export default async function (fastify) {
  // Route to display and manage items
  fastify.get("/", async (request, reply) => {
    // Placeholder for fetching items from the database
    const items = await fastify.Item.find({});

    return reply.view("admin/item.ejs", {
      title: "Manage Items",
      currentPath: "/admin/item",
      items
    });
  });

  // Route to create or edit an item
  fastify.post("/", async (request, reply) => {
    const { itemId, sku, name, price, tags } = request.body;

    const parsedTags = tags ? tags.split(",").map(tag => tag.trim()) : [];

    // Placeholder logic to create or update an item
    try {
      if (itemId) {
      await fastify.Item.findByIdAndUpdate(itemId, { sku, name, price, tags: parsedTags });
    } else {
      await fastify.Item.create({ sku, name, price, tags: parsedTags });
    }

    request.session.set("messages", [{type: "success", text: itemId ? "Item updated successfully!" : "Item created successfully!"}]);
    fastify.log.info(`Item ${itemId ? "updated" : "created"}:`, name);

    } catch (error) {
      request.session.set("messages", [{type: "danger", text: "An error occurred while saving the item."}]);
      fastify.log.error("Error saving item:", error);
    }    
    return reply.redirect("/admin/item");
  });

  // Route to delete an item
  fastify.get("/delete/:id", async (request, reply) => {
    const { id } = request.params;

    // Placeholder logic to delete an item
    try {
      await fastify.Item.findByIdAndDelete(id);
      request.session.set("messages", [{type: "success", text: "Item deleted successfully!"}]);
      fastify.log.info(`Deleting item with id: ${id}`);
    } catch (error) {
      request.session.set("messages", [{type: "danger", text: "An error occurred while deleting the item."}]);
      fastify.log.error("Error deleting item:", error);
    }

    return reply.redirect("/admin/item");
  });

  // Route to fetch a single item for editing
  fastify.get("/:id", async (request, reply) => {
    const { id } = request.params;

    // Placeholder for fetching a single item from the database
    const item = await fastify.Item.findById(id);

    return reply.view("admin/item.ejs", {
      title: "Edit Item",
      currentPath: "/admin/item",
      items: [], // Pass empty items array for simplicity
      item
    });
  });
}
