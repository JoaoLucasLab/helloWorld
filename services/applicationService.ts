import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Application } from "@/types/application";

// Applications are stored per user at users/{userId}/applications/{applicationId},
// so security rules can make sure each user only reaches their own data.
function applicationsCollection(userId: string) {
  return collection(db, "users", userId, "applications");
}

function applicationDocument(userId: string, applicationId: string) {
  return doc(db, "users", userId, "applications", applicationId);
}

export async function getApplications(userId: string): Promise<Application[]> {
  const snapshot = await getDocs(applicationsCollection(userId));

  return snapshot.docs.map((document) => {
    const { company, status, link, date, description } = document.data();

    return { id: document.id, company, status, link, date, description };
  });
}

export async function createApplication(
  userId: string,
  application: Omit<Application, "id">
): Promise<Application> {
  const reference = await addDoc(applicationsCollection(userId), {
    ...application,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return { ...application, id: reference.id };
}

export async function updateApplication(
  userId: string,
  updatedApplication: Application
): Promise<Application> {
  const { id, ...fields } = updatedApplication;

  if (!id) throw new Error("Cannot update an application without an id.");

  await updateDoc(applicationDocument(userId, id), { ...fields, updatedAt: serverTimestamp() });

  return updatedApplication;
}

export async function deleteApplication(userId: string, id: string): Promise<void> {
  await deleteDoc(applicationDocument(userId, id));
}
