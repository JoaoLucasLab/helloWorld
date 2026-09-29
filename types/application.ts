export type ApplicationStatus = 
  | "Interested"
  | "Appliede"
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
}