export type ApplicationStatus = 
  | "Interested"
  | "Applied"
  | "Interview"
  | "Offer"
  | "Rejected";


export type Application = {
  id?: string;
  company: string;
  status: ApplicationStatus;
  link: string;
  date: string;
  description: string;
};
