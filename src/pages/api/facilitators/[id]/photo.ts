import type { APIRoute } from "astro";
// import { clerkClient } from "@clerk/astro/server";
import { turso } from "../../../../lib/turso";

export const prerender = false;

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/heic",
  "image/heif",
]);

// --- GET: serve the photo blob from the database ---
export const GET: APIRoute = async ({ params }) => {
  const { id } = params;

  if (!id) {
    return new Response(JSON.stringify({ error: "ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const result = await turso.execute({
      sql: "SELECT photo FROM Facilitators WHERE id = ?",
      args: [id],
    });

    const row = result.rows[0] as any;
    if (!row?.photo) {
      return new Response(null, { status: 404 });
    }

    // photo is stored as a blob (ArrayBuffer)
    const photoBuffer =
      row.photo instanceof ArrayBuffer
        ? row.photo
        : new Uint8Array(row.photo).buffer;

    return new Response(photoBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/jpeg", // default; stored photos are jpg/png
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error fetching photo:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch photo" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

// --- POST: upload a photo blob to the database ---
export const POST: APIRoute = async (context) => {
  const { params, request, locals } = context;
  const { id } = params;

  if (!id) {
    return new Response(JSON.stringify({ error: "ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // --- Admin-only auth guard ---
  const user = await locals.currentUser();
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // const orgMemberships = await clerkClient(context)
  //   .users.getOrganizationMembershipList({ userId: user.id });
  // const isAdmin = orgMemberships?.data?.some(
  //   (org: any) => org.role === "org:admin"
  // );
  const isAdmin = false;

  // Also allow the facilitator themselves to upload their own photo
  let isSelf = false;
  if (!isAdmin) {
    const facilitatorResult = await turso.execute({
      sql: "SELECT email FROM Facilitators WHERE id = ?",
      args: [id],
    });
    const facilitatorEmail = (facilitatorResult.rows[0] as any)?.email;
    const userEmail = user.emailAddresses?.[0]?.emailAddress;
    isSelf = !!(facilitatorEmail && userEmail && facilitatorEmail === userEmail);
  }

  if (!isAdmin && !isSelf) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("photo") as File | null;

    if (!file) {
      return new Response(
        JSON.stringify({ error: "No photo file provided" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.has(file.type)) {
      return new Response(
        JSON.stringify({
          error: "Invalid file type. Allowed formats: jpg, png, webp, avif, gif, heic.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return new Response(
        JSON.stringify({ error: "File too large. Maximum size is 5 MB." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const photoBytes = new Uint8Array(arrayBuffer);

    await turso.execute({
      sql: "UPDATE Facilitators SET photo = ?, updatedDate = datetime('now') WHERE id = ?",
      args: [photoBytes as any, id],
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error uploading photo:", error);
    return new Response(
      JSON.stringify({ error: "Failed to upload photo" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
