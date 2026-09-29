"use client";

import { useEffect, useState } from "react";
import type { Application } from "@/types/application";
import {
  createApplication,
  deleteApplication,
  getApplications,
  updateApplication,
} from "@/services/applicationService";

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadApplications() {
      const data = await getApplications();

      setApplications(data);
      setIsLoading(false);
    }

    loadApplications();
  }, []);

  async function addApplication(application: Application) {
    const newApplication = await createApplication(application);

    setApplications((currentApplications) => [
      ...currentApplications,
      newApplication,
    ]);
  }

  async function editApplication(application: Application) {
    const updatedApplication = await updateApplication(application);

    setApplications((currentApplications) =>
      currentApplications.map((currentApplication) =>
        currentApplication.id === updatedApplication.id
          ? updatedApplication
          : currentApplication
      )
    );
  }

  async function removeApplication(id: string) {
    await deleteApplication(id);

    setApplications((currentApplications) =>
      currentApplications.filter((application) => application.id !== id)
    );
  }

  return {
    applications,
    isLoading,
    addApplication,
    editApplication,
    removeApplication,
  };
}