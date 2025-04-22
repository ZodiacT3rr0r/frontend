// Enums

export enum Privilege {
  Admin = "Admin",
  PM = "PM",
  TeamMember = "Team Member",
  Viewer = "Viewer"
}

export enum SprintStatus {
  Planned = "planned",
  Active = "active",
  Completed = "completed"
}

export enum TaskType {
  TASK = "task",
  BUG = "bug",
  STORY = "story",
}

export enum TaskWorkflowStatus {
  BACKLOG = "backlog",
  SELECTED = "selected",
  IN_PROGRESS = "inprogress",
  DONE = "done",
}

export enum TaskPriority {
  P5 = "5",
  P4 = "4",
  P3 = "3",
  P2 = "2",
  P1 = "1",
}


export enum TaskSeverity {
  CRITICAL = "Critical",
  HIGH = "High",
  MEDIUM = "Medium",
  LOW = "Low",
}


export const TaskTypeCopy: Record<TaskType, string> = {
  [TaskType.TASK]: "Task",
  [TaskType.BUG]: "Bug",
  [TaskType.STORY]: "Story",
};

export const TaskWorkflowStatusCopy: Record<TaskWorkflowStatus, string> = {
  [TaskWorkflowStatus.BACKLOG]: "Backlog",
  [TaskWorkflowStatus.SELECTED]: "Selected for Development",
  [TaskWorkflowStatus.IN_PROGRESS]: "In Progress",
  [TaskWorkflowStatus.DONE]: "Done",
};

export const TaskPriorityCopy: Record<TaskPriority, string> = {
  [TaskPriority.P5]: "P5",
  [TaskPriority.P4]: "P4",
  [TaskPriority.P3]: "P3",
  [TaskPriority.P2]: "P2",
  [TaskPriority.P1]: "P1",
};

// Base Type

export interface BaseEntity {
  created_at: Date;
  updated_at?: Date;
  updated_by?: string | null;
  required_action_privilege: Privilege;
}

// Main Entities

export interface Organisation extends BaseEntity {
  id: string;
  name: string;
  logo: string;
  contact_email: string;
  active_projects: Project[];
  archived_projects: Project[];
  employees: Employee[];
  owner: Employee;
}

export interface Employee extends BaseEntity {
  id: string;
  name: string;
  email: string;
  role: Privilege;
  org: string;
  assigned_projects: string[];
  assigned_tasks: string[];
  archived_projects: string[];
  archived_tasks: string[];
}

export interface Project extends BaseEntity {
  id: string;
  name: string;
  description: string;
  employees: string[];
  tasks: string[]; // Task IDs
  sprints: string[];
  deadline: Date;
}

// Unified Task with Task attributes

export interface Task extends BaseEntity {
  id: string;
  problem_statement: string;
  description: string;
  associated_files: string[];
  deadline: Date;
  pre_requisite_tasks: Task[];
  dependent_tasks: Task[];
  story_points: number;
  status: TaskWorkflowStatus;
  started_at?: Date;
  completed_at?: Date;
  estimated_hours: number;
  actual_hours: number;
  blocked: boolean;
  blocked_reason?: string;
  status_change_events: TaskStatusChange[];
  comments: Comment[];
  files: File[];
  parent_sprint?: Sprint;
  project: Project;
  type: TaskType;
  priority: TaskPriority;
  severity: TaskSeverity;
}

export interface TaskStatusChange extends BaseEntity {
  id: string;
  task: Task;
  pre_status: TaskWorkflowStatus;
  post_status: TaskWorkflowStatus;
  timestamp: Date;
}

export interface Comment extends BaseEntity {
  id: string;
  author: Employee;
  associated_entity: Task | Project | Sprint;
  content: string;
  associated_files: File[];
  timestamp: Date;
}

export interface File extends BaseEntity {
  id: string;
  file_url: string;
  uploaded_by: Employee;
  timestamp: Date;
  task?: Task;
  project?: Project;
}

export interface Sprint extends BaseEntity {
  id: string;
  project: Project;
  assigned_members: Employee[];
  tasks: Task[];
  scrum_master: Employee;
  start_date: Date;
  end_date: Date;
  status: SprintStatus;
  total_story_points: number;
  completed_story_points: number;
  historical_state: Array<{
    timestamp: Date;
    state: Record<string, any>;
  }>;
}
