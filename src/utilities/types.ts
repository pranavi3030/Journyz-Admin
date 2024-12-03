import { Timestamp } from "firebase/firestore";

export type Company = {
  id?: string;
  name: string;
  address: string;
  industry: string;
  score: string;
  size: string;
  years: string;
};

export type Department = {
  id?: string;
  name: string;
  opAreaCount?: number;
};

export type OpArea = {
  id?: string;
  name: string;
  description: string;
  KPIs?: string[];
  projects?: string[];
  specialInitiatives?: string[];
  assessmentCount?: number;
};

export type Assessment = {
  id?: string;
  date: Timestamp;
  employeeId: string;
  employee?: Employee;
  companyId: string;
  departmentId: string;
  operationalAreaId: string;
  responses: Response[];
  score: number;
};

export type Response = {
  question: string;
  answer: number[];
  score: number;
  options: string[];
  type: "multi" | "single";
};

export type Employee = {
  id?: string;
  name: string;
  phone: string;
  email: string;
  role: string;
  departmentId: string;
  companyId: string;
  operationalAreaId: string;
};
