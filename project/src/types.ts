export interface User {
  id: number;
  name: string;
  domain: string;
  github: string;
  linkedin: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  assignedTo?: string;
}