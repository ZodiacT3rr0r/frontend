import { 
  Privilege, 
  Employee, 
  Project, 
  Sprint, 
  Task, 
  TaskWorkflowStatus, 
  SprintStatus, 
  TaskType, 
  TaskPriority, 
  TaskSeverity 
} from './Types';

// Base entity fields
const baseEntityFields = {
  created_at: new Date(),
  updated_at: new Date(),
  required_action_privilege: Privilege.TeamMember,
  updated_by: undefined as string | undefined,
};

// Mock Employees
export const mockEmployees: Employee[] = [
  {
    id: "emp-1",
    name: "John Smith",
    email: "john@example.com",
    role: Privilege.PM,
    ...baseEntityFields,
    org: "org-1",
    assigned_projects: ["project-1", "project-2"],
    assigned_tasks: ["task-1", "task-3", "task-7"],
    archived_projects: [],
    archived_tasks: []
  },
  {
    id: "emp-2",
    name: "Alice Johnson",
    email: "alice@example.com",
    role: Privilege.TeamMember,
    ...baseEntityFields,
    org: "org-1",
    assigned_projects: ["project-1"],
    assigned_tasks: ["task-2", "task-4"],
    archived_projects: [],
    archived_tasks: []
  },
  {
    id: "emp-3",
    name: "Bob Wilson",
    email: "bob@example.com",
    role: Privilege.Admin,
    ...baseEntityFields,
    org: "org-1",
    assigned_projects: ["project-1", "project-2"],
    assigned_tasks: ["task-5", "task-8"],
    archived_projects: [],
    archived_tasks: []
  },
  {
    id: "emp-4",
    name: "Emma Davis",
    email: "emma@example.com",
    role: Privilege.TeamMember,
    ...baseEntityFields,
    org: "org-1",
    assigned_projects: ["project-2"],
    assigned_tasks: ["task-6", "task-9"],
    archived_projects: [],
    archived_tasks: []
  }
];

// Mock Projects
export const mockProjects: Project[] = [
  {
    id: "project-1",
    name: "Task Management System",
    description: "A comprehensive task management system for teams",
    ...baseEntityFields,
    employees: ["emp-1", "emp-2", "emp-3"],
    tasks: ["task-1", "task-2", "task-3", "task-4", "task-5"],
    sprints: ["sprint-1", "sprint-2"],
    deadline: new Date(2025, 11, 31)
  },
  {
    id: "project-2",
    name: "E-commerce Platform",
    description: "Next-gen online shopping platform",
    ...baseEntityFields,
    employees: ["emp-1", "emp-3", "emp-4"],
    tasks: ["task-6", "task-7", "task-8", "task-9"],
    sprints: ["sprint-3"],
    deadline: new Date(2025, 8, 15)
  }
];

// Mock Sprints
export const mockSprints: Sprint[] = [
  {
    id: "sprint-1",
    ...baseEntityFields,
    project: "project-1",
    assigned_members: ["emp-1", "emp-2"],
    tasks: ["task-1", "task-2"],
    scrum_master: "emp-1",
    start_date: new Date(2025, 4, 1),
    end_date: new Date(2025, 4, 14),
    status: SprintStatus.Completed,
    total_story_points: 20,
    completed_story_points: 18,
    historical_state: []
  },
  {
    id: "sprint-2",
    ...baseEntityFields,
    project: "project-1",
    assigned_members: ["emp-1", "emp-3"],
    tasks: ["task-3", "task-4"],
    scrum_master: "emp-1",
    start_date: new Date(2025, 5, 1),
    end_date: new Date(2025, 5, 14),
    status: SprintStatus.Active,
    total_story_points: 15,
    completed_story_points: 5,
    historical_state: []
  },
  {
    id: "sprint-3",
    ...baseEntityFields,
    project: "project-2",
    assigned_members: ["emp-3", "emp-4"],
    tasks: ["task-6", "task-7"],
    scrum_master: "emp-3",
    start_date: new Date(2025, 6, 1),
    end_date: new Date(2025, 6, 14),
    status: SprintStatus.Planned,
    total_story_points: 25,
    completed_story_points: 0,
    historical_state: []
  }
];

// Mock Tasks
export const mockTasks: Task[] = [
  {
    id: "task-1",
    ...baseEntityFields,
    problem_statement: "Implement user authentication",
    description: "Create login functionality with OAuth2 integration",
    type: TaskType.STORY,
    priority: TaskPriority.P1,
    severity: TaskSeverity.HIGH,
    status: TaskWorkflowStatus.DONE,
    story_points: 8,
    estimated_hours: 16,
    actual_hours: 14,
    project: "project-1",
    parent_sprint: "sprint-1",
    assignee: "emp-1"
  },
  {
    id: "task-2",
    ...baseEntityFields,
    problem_statement: "Fix password validation bug",
    description: "Password special characters not being recognized",
    type: TaskType.BUG,
    priority: TaskPriority.P2,
    severity: TaskSeverity.CRITICAL,
    status: TaskWorkflowStatus.DONE,
    story_points: 3,
    estimated_hours: 4,
    actual_hours: 3,
    project: "project-1",
    parent_sprint: "sprint-1",
    assignee: "emp-2"
  },
  {
    id: "task-3",
    ...baseEntityFields,
    problem_statement: "Implement task sorting",
    description: "Add drag-and-drop task prioritization",
    type: TaskType.STORY,
    priority: TaskPriority.P2,
    severity: TaskSeverity.MEDIUM,
    status: TaskWorkflowStatus.IN_PROGRESS,
    story_points: 5,
    estimated_hours: 8,
    actual_hours: 4,
    project: "project-1",
    parent_sprint: "sprint-2",
    assignee: "emp-1"
  },
  {
    id: "task-4",
    ...baseEntityFields,
    problem_statement: "Mobile view optimization",
    description: "Improve responsive design for mobile devices",
    type: TaskType.TASK,
    priority: TaskPriority.P3,
    severity: TaskSeverity.LOW,
    status: TaskWorkflowStatus.SELECTED,
    story_points: 5,
    estimated_hours: 6,
    actual_hours: 0,
    project: "project-1",
    parent_sprint: "sprint-2",
    assignee: "emp-3"
  },
  {
    id: "task-5",
    ...baseEntityFields,
    problem_statement: "Database optimization",
    description: "Optimize SQL queries for better performance",
    type: TaskType.TASK,
    priority: TaskPriority.P4,
    severity: TaskSeverity.MEDIUM,
    status: TaskWorkflowStatus.BACKLOG,
    story_points: 8,
    estimated_hours: 12,
    actual_hours: 0,
    project: "project-1"
  },
  {
    id: "task-6",
    ...baseEntityFields,
    problem_statement: "Product page UI development",
    description: "Create responsive product page template",
    type: TaskType.STORY,
    priority: TaskPriority.P1,
    severity: TaskSeverity.HIGH,
    status: TaskWorkflowStatus.IN_PROGRESS,
    story_points: 13,
    estimated_hours: 24,
    actual_hours: 12,
    project: "project-2",
    parent_sprint: "sprint-3",
    assignee: "emp-4"
  },
  {
    id: "task-7",
    ...baseEntityFields,
    problem_statement: "Payment gateway integration",
    description: "Integrate Stripe payment processing",
    type: TaskType.STORY,
    priority: TaskPriority.P2,
    severity: TaskSeverity.CRITICAL,
    status: TaskWorkflowStatus.SELECTED,
    story_points: 8,
    estimated_hours: 16,
    actual_hours: 0,
    project: "project-2",
    parent_sprint: "sprint-3",
    assignee: "emp-3"
  },
  {
    id: "task-8",
    ...baseEntityFields,
    problem_statement: "Shopping cart bug",
    description: "Items disappearing from cart after refresh",
    type: TaskType.BUG,
    priority: TaskPriority.P1,
    severity: TaskSeverity.HIGH,
    status: TaskWorkflowStatus.BACKLOG,
    story_points: 5,
    estimated_hours: 6,
    actual_hours: 0,
    project: "project-2"
  },
  {
    id: "task-9",
    ...baseEntityFields,
    problem_statement: "User profile management",
    description: "Create profile editing interface",
    type: TaskType.TASK,
    priority: TaskPriority.P3,
    severity: TaskSeverity.MEDIUM,
    status: TaskWorkflowStatus.BACKLOG,
    story_points: 8,
    estimated_hours: 10,
    actual_hours: 0,
    project: "project-2"
  }
];

// Initialize session storage
if (typeof window !== 'undefined' && !sessionStorage.getItem("selectedProject")) {
  sessionStorage.setItem("selectedProject", JSON.stringify({ id: mockProjects[0].id }));
}

// Resolver functions
const resolvers = {
  resolveProject: (id: string) => mockProjects.find(p => p.id === id),
  resolveEmployee: (id: string) => mockEmployees.find(e => e.id === id),
  resolveTask: (id: string) => mockTasks.find(t => t.id === id),
  resolveSprint: (id: string) => mockSprints.find(s => s.id === id),
};

// API functions
export const fetchSprintsByProject = async (projectId: string): Promise<Sprint[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const project = resolvers.resolveProject(projectId);
      resolve(project?.sprints.map(id => resolvers.resolveSprint(id)!) || []);
    }, 500);
  });
};

export const fetchBacklogTasksByProject = async (projectId: string): Promise<Task[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const project = resolvers.resolveProject(projectId);
      if (!project) return resolve([]);

      const sprintTaskIds = project.sprints
        .flatMap(sprintId => resolvers.resolveSprint(sprintId)?.tasks || []);

      resolve(project.tasks
        .filter(taskId => !sprintTaskIds.includes(taskId))
        .map(taskId => resolvers.resolveTask(taskId)!));
    }, 500);
  });
};

export const fetchProjectById = async (projectId: string): Promise<Project | null> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(resolvers.resolveProject(projectId) || null);
    }, 500);
  });
};

export const fetchEmployeesByProject = async (projectId: string): Promise<Employee[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockEmployees);
    }, 500);
  });
};

// Sprint handlers
export const handleCreateSprint = async (projectId: string, sprintData: Omit<Sprint, "id">): Promise<Sprint | null> => {
  try {
    const project = resolvers.resolveProject(projectId);
    if (!project) return null;

    const newSprint: Sprint = {
      ...sprintData,
      id: `sprint-${Date.now()}`,
      ...baseEntityFields,
      project: projectId,
      tasks: [],
      total_story_points: 0,
      completed_story_points: 0,
      historical_state: []
    };

    mockSprints.push(newSprint);
    project.sprints.push(newSprint.id);
    return newSprint;
  } catch (error) {
    console.error(error);
    return null;
  }
};

