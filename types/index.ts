export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Idea {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  professions: string[];
  category: string;
  timeRequired: string;
  isPaid: boolean;
  membersNeeded: number;
  author: User;
  createdAt: string;
}

export interface Application {
  id: string;
  ideaId: string;
  userId: string;
  name: string;
  email: string;
  coverLetter: string;
  cvLink: string;
  createdAt: string;
}