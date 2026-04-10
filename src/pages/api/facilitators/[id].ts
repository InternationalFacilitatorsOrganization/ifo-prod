import type { APIRoute } from "astro";
import { clerkClient } from "@clerk/astro/server";
import type { InValue } from "@libsql/client";
import { turso, getFacilitatorById } from "../../../lib/turso";
import { sanitizeFields } from "../../../lib/facilitator-fields";

export const prerender = false;

export const PUT: APIRoute = async (context) => {
  const { params, request, locals } = context;
  const { id } = params;

  if (!id) {
    return new Response(JSON.stringify({ error: "ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // --- Auth guard ---
  const user = await locals.currentUser();
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const orgMemberships = await clerkClient(context)
    .users.getOrganizationMembershipList({ userId: user.id });
  const isAdmin = orgMemberships?.data?.some(
    (org: any) => org.role === "org:admin"
  );

  // Allow admin OR self-edit (user's email matches facilitator's email)
  if (!isAdmin) {
    const facilitator = await getFacilitatorById(id);
    const userEmail = user.emailAddresses?.[0]?.emailAddress;
    if (!facilitator || facilitator.email !== userEmail) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  try {
    const raw = await request.json();

    // Sanitize: only allow known, writable columns
    const updates = sanitizeFields(raw);
    const fields = Object.keys(updates);

    if (fields.length === 0) {
      return new Response(
        JSON.stringify({ error: "No valid fields to update" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const setClause = fields.map((field) => `${field} = ?`).join(", ");
    const values = fields.map((field) => updates[field] as InValue);

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
    return new Response(
      JSON.stringify({ error: "Failed to update facilitator" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
