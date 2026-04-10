import type { APIRoute } from "astro";
import { clerkClient } from "@clerk/astro/server";
import type { InValue } from "@libsql/client";
import { turso } from "../../../lib/turso";
import { sanitizeFields } from "../../../lib/facilitator-fields";

export const prerender = false;

export const POST: APIRoute = async (context) => {
  const { request, locals } = context;

  // --- Admin-only auth guard ---
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

  if (!isAdmin) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const raw = await request.json();

    // Validate required fields
    const { firstName, lastName, email, status } = raw;
    if (!firstName || !lastName || !email) {
      return new Response(
        JSON.stringify({ error: "firstName, lastName, and email are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Generate next sequential ID
    const maxResult = await turso.execute(
      "SELECT MAX(CAST(id AS INTEGER)) AS maxId FROM Facilitators"
    );
    const maxId = (maxResult.rows[0] as any)?.maxId ?? 0;
    const newId = String(Number(maxId) + 1);

    // Sanitize writable fields, then manually add managed fields
    const safeData = sanitizeFields(raw);
    const now = new Date()
      .toISOString()
      .replace("T", " ")
      .replace(/\.\d{3}Z$/, "");

    // Build the full record
    const record: Record<string, unknown> = {
      id: newId,
      createdDate: now,
      updatedDate: now,
      firstName,
      lastName,
      email,
      status: status || "Active",
      ...safeData, // overlay any other valid fields
    };

    const columns = Object.keys(record);
    const placeholders = columns.map(() => "?").join(", ");
    const values = columns.map((col) => record[col] as InValue);

    await turso.execute({
      sql: `INSERT INTO Facilitators (${columns.join(", ")}) VALUES (${placeholders})`,
      args: values,
    });

    return new Response(JSON.stringify({ success: true, id: newId }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating facilitator:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create facilitator" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
