"use client";

import { useState } from "react";
import type { SyntheticEvent } from "react";
import type { Application, ApplicationStatus } from "@/types/application";

type ApplicationFormProps = {
  onSubmit: (application: Omit<Application, "id">) => Promise<void>;
  // When editing, the form starts filled with the existing application.
  initialApplication?: Application;
  submitLabel?: string;
  onCancel?: () => void;
};
export function ApplicationForm({ onSubmit, initialApplication, submitLabel = "Add application", onCancel }: ApplicationFormProps) {
  const isEditing = Boolean(initialApplication);
  const [company, setCompany] = useState(initialApplication?.company ?? "");
  const [status, setStatus] = useState<ApplicationStatus>(initialApplication?.status ?? "Applied");
  const [link, setLink] = useState(initialApplication?.link ?? "");
  const [date, setDate] = useState(initialApplication?.date ?? "");
  const [description, setDescription] = useState(initialApplication?.description ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      await onSubmit({ company, status, link, date, description });
      // Only clear the form once the application is saved, so nothing typed is lost on failure.
      // When editing, the parent closes the form instead.
      if (!isEditing) { setCompany(""); setStatus("Applied"); setLink(""); setDate(""); setDescription(""); }
    } catch (submitError) {
      console.error(submitError);
      setError("Could not save the application. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }
  return (
    <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
      <label className="field-label">Company<input required value={company} onChange={(event) => setCompany(event.target.value)} placeholder="e.g. Acme Inc." className="field-input" /></label>
      <label className="field-label">Status<select value={status} onChange={(event) => setStatus(event.target.value as ApplicationStatus)} className="field-input"><option>Interested</option><option>Applied</option><option>Interview</option><option>Offer</option><option>Rejected</option></select></label>
      <label className="field-label">Job link<input type="url" value={link} onChange={(event) => setLink(event.target.value)} placeholder="https://example.com/job" className="field-input" /></label>
      <label className="field-label">Application date<input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="field-input" /></label>
      <label className="field-label md:col-span-2">Description<textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={4} placeholder="Notes about the role or next steps..." className="field-input resize-y" /></label>
      {error && <p role="alert" className="text-sm text-red-600 md:col-span-2">{error}</p>}
      <div className="flex gap-3 md:col-span-2">
        <button type="submit" disabled={isSaving} className="primary-button md:w-fit disabled:opacity-60">{isSaving ? "Saving..." : submitLabel}</button>
        {onCancel && <button type="button" onClick={onCancel} disabled={isSaving} className="secondary-button form-cancel-button">Cancel</button>}
      </div>
    </form>
  );
}
