import { db } from "@/db";
import { licenses, projectLicenses } from "@/db/schema";
import { eq } from "drizzle-orm";

export const checkIfLicenseExists = async (key: string) => {
  const license = await db.select().from(licenses).where(eq(licenses.key, key));

  return license[0];
};

export const getLicense = async (projectId: number) => {
  const license = await db
    .select()
    .from(licenses)
    .innerJoin(projectLicenses, eq(licenses.id, projectLicenses.licenseId))
    .where(eq(projectLicenses.projectId, projectId));

  return license[0];
};

export const createLicense = async (license: typeof licenses.$inferInsert) => {
  const [newLicense] = await db.insert(licenses).values(license).returning();

  return newLicense;
};

export const updateLicenseProjectTable = async (
  licenseId: number,
  projectId: number
) => {
  await db.insert(projectLicenses).values({
    licenseId,
    projectId,
  });
};
