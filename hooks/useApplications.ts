"use client";

import { useEffect, useState } from "react";
import type { Application } from "@/types/application";
import {
  createApplication,
  deleteApplication,
  getApplications,
  updateApplication,
} from "@/services/applicationService";

export function useApplications(userId: string) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    async function loadApplications() {
      try {
        const data = await getApplications(userId);

        if (isCurrent) setApplications(data);
      } catch (loadError) {
        console.error(loadError);
        if (isCurrent) setError("Could not load applications. Check your Firebase configuration and connection.");
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }

    loadApplications();

    // Ignore a slow response if the user changes (e.g. signs out) before it arrives.
    return () => {
      isCurrent = false;
    };
  }, [userId]);

  async function addApplication(application: Omit<Application, "id">) {
    const newApplication = await createApplication(userId, application);

    setApplications((currentApplications) => [
      ...currentApplications,
      newApplication,
    ]);
  }

  async function editApplication(application: Application) {
    const updatedApplication = await updateApplication(userId, application);

    setApplications((currentApplications) =>
      currentApplications.map((currentApplication) =>
        currentApplication.id === updatedApplication.id
          ? updatedApplication
          : currentApplication
      )
    );
  }

  async function removeApplication(id: string) {
    await deleteApplication(userId, id);

    setApplications((currentApplications) =>
      currentApplications.filter((application) => application.id !== id)
    );
  }

  return {
    applications,
    isLoading,
    error,
    addApplication,
    editApplication,
    removeApplication,
  };
}
