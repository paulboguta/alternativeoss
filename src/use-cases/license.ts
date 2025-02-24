import {
  checkIfLicenseExists,
  createLicense,
  updateLicenseProjectTable,
} from "@/data-access/license";

export const updateLicenseProjectUseCase = async (
  licenseKey: string,
  projectId: number
) => {
  let license = await checkIfLicenseExists(licenseKey);

  if (!license) {
    license = await createLicense({
      name: licenseKey,
      key: licenseKey,
    });
  }

  await updateLicenseProjectTable(license.id, projectId);
};
