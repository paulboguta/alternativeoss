import { db } from '@/db';
import { licenses, projectLicenses } from '@/db/schema';
import { License } from '@/types/license';
import { eq } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';

export const checkIfLicenseExists = async (key: string): Promise<License> => {
  const license = await db.select().from(licenses).where(eq(licenses.key, key));

  return license[0];
};

export const createLicense = async (license: typeof licenses.$inferInsert): Promise<License> => {
  const [newLicense] = await db.insert(licenses).values(license).returning();

  return newLicense;
};

export const updateLicenseProjectTable = async (licenseId: number, projectId: number) => {
  await db.insert(projectLicenses).values({
    licenseId,
    projectId,
  });

  // Revalidate cache tags
  revalidateTag(`license/${projectId}`);
  revalidateTag(`project/${projectId}`);
};
