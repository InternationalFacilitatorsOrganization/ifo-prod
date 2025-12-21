import { createClient } from "@libsql/client";

const turso = createClient({
  url: import.meta.env.TURSO_DATABASE_URL,
  authToken: import.meta.env.TURSO_AUTH_TOKEN,
});

export interface Facilitator {
  id: string;
  createdDate: string;
  updatedDate: string;
  firstName: string;
  lastName: string;
  email: string;
  languages?: string;
  country?: string;
  timezone?: string;
  location?: string;
  website?: string;
  yearsOfExperience?: string;
  areasOfExpertise?: string;
  certifications?: string;
  fees?: string;
  programsOffered?: string;
  programOffered?: string;
  clientList?: string;
  status?: string;
  bio?: string;
}

export async function getAllFacilitators(): Promise<Facilitator[]> {
  const result = await turso.execute("SELECT * FROM Facilitators ORDER BY lastName");
  return result.rows as unknown as Facilitator[];
}

export async function getFacilitatorById(id: string): Promise<Facilitator | null> {
  const result = await turso.execute({
    sql: "SELECT * FROM Facilitators WHERE id = ?",
    args: [id],
  });
  return result.rows[0] as unknown as Facilitator | null;
}

export { turso };
