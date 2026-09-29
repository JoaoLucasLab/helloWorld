import type { Application } from "@/types/application";

let applications: Application[] = [];

export async function getApplications(): Promise<Application[]> {
  return applications;
}

export async function createApplication(
  application: Application
): Promise<Application> {
  const newApplication: Application = {
    ...application,
    id: crypto.randomUUID(),
  };

  applications = [...applications, newApplication];

  return newApplication;
}

export async function updateApplication(
  updatedApplication: Application
): Promise<Application> {
  applications = applications.map((application) =>
    application.id === updatedApplication.id
      ? updatedApplication
      : application
  );

  return updatedApplication;
}

export async function deleteApplication(id: string): Promise<void> {
  applications = applications.filter(
    (application) => application.id !== id
  );
}
