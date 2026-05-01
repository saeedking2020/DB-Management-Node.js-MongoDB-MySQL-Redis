export default async function (fastify) {
  // Route to display all items with pagination
  fastify.get("/:tag?", async (request, reply) => {
    const { page = 1, limit = 10, q} = request.query; // Defaults: page 1, 10 items per page
    const { tag } = request.params;
    
    const itemQuery = {};

    if (tag) {
      itemQuery.tags = tag; // Filter items by the specified tag
    }
    if (q) {
      itemQuery.$text = { $search: q }; // Add full-text search condition
    }
     
    const allItems = await fastify.Item.find(itemQuery)
    .sort({ name: 1 }) // Sort items by name in ascending order
    .skip((page - 1) * limit)
    .limit(limit);
    
    const tags = await fastify.Item.distinct("tags"); // Get all unique tags

    const totalPages = Math.ceil((await fastify.Item.countDocuments(itemQuery)) / limit);
    // Render the shop view with paginated items and tags
    return reply.view("shop.ejs", {
      title: "Shop",
      currentPath: "/shop",
      items: allItems,
      tags,
      currentPage: parseInt(page, 10),
      totalPages,
      currentTag: tag || null
    });
  });
}
