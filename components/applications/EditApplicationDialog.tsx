"use client";

import { useId } from "react";
import { Modal } from "@/components/ui/Modal";
import type { Application } from "@/types/application";
import { ApplicationForm } from "./ApplicationForm";

type EditApplicationDialogProps = {
  application: Application;
  onSave: (application: Application) => Promise<void>;
  onClose: () => void;
};

export function EditApplicationDialog({ application, onSave, onClose }: EditApplicationDialogProps) {
  const titleId = useId();

  async function handleSubmit(fields: Omit<Application, "id">) {
    // Errors propagate to the form, which shows them and keeps the popup open.
    await onSave({ ...fields, id: application.id });
    onClose();
  }

  return (
    <Modal onClose={onClose} labelledBy={titleId} className="edit-application-dialog">
      <div className="mb-5">
        <p className="eyebrow">Update opportunity</p>
        <h2 id={titleId} className="modal-title">Edit {application.company}</h2>
      </div>
      <ApplicationForm initialApplication={application} onSubmit={handleSubmit} submitLabel="Save changes" onCancel={onClose} />
    </Modal>
  );
}
