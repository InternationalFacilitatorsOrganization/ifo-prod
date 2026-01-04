import type { APIRoute } from "astro";
import { turso } from "../../../lib/turso";

export const prerender = false;

export const PUT: APIRoute = async ({ params, request }) => {
  const { id } = params;
  
  if (!id) {
    return new Response(JSON.stringify({ error: "ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const updates = await request.json();
    
    // Build dynamic SQL update query
    const fields = Object.keys(updates).filter(key => key !== 'id');
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => updates[field]);
    
    await turso.execute({
      sql: `UPDATE Facilitators SET ${setClause}, updatedDate = datetime('now') WHERE id = ?`,
      args: [...values, id],
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating facilitator:", error);
    return new Response(JSON.stringify({ error: "Failed to update facilitator" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
