export interface Reference {
  _id?: string;
  publicId: string;     // Stable public identifier for external/API use (XSS/Objectid hiding)
  name: string;
  relationship: "coworker" | "client" | "manager";
  company?: string;
  linkedin?: string;
  email?: string;       // Recommender's email (for future Resend notifications)
  comment: string;
  approved: boolean;    // Backwards compatibility moderation flag
  status: "pending" | "approved" | "rejected"; // Primary moderation field
  token?: string;       // Private submission token for /reference/[token]
  sourceToken?: string; // Identifies which private submission invitation link was used
  createdAt: Date;
  updatedAt: Date;
}
