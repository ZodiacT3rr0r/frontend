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
  TaskSeverity,
} from "./Types";

// Declare a global interface for Window with our custom property
declare global {
  interface Window {
    MOCK_DATA_INITIALIZED?: boolean;
  }
}

// Helper functions to find entities by ID - moved to the top to avoid hoisting issues
export const findProjectById = (id: string): Project | undefined =>
  mockProjects.find((p) => p.id === id);

export const findEmployeeById = (id: string): Employee | undefined =>
  mockEmployees.find((e) => e.id === id);

export const findTaskById = (id: string): Task | undefined =>
  mockTasks.find((t) => t.id === id);

export const findSprintById = (id: string): Sprint | undefined =>
  mockSprints.find((s) => s.id === id);

// Base entity fields
const baseEntityFields = {
  created_at: new Date(),
  updated_at: new Date(),
  required_action_privilege: Privilege.TeamMember,
  updated_by: undefined as string | undefined,
};

// First, create data structures without circular references
// We'll create employees and projects first as they use string references in arrays

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
    archived_tasks: [],
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
    archived_tasks: [],
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
    archived_tasks: [],
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
    archived_tasks: [],
  },
];

// Mock Projects
export const mockProjects: Project[] = [
  {
    id: "project-1",
    name: "Task Management System",
    description: "A comprehensive task management system for teams",
    ...baseEntityFields,
    employees: ["emp-1", "emp-2", "emp-3"],
    tasks: ["task-1", "task-2", "task-3", "task-4", "task-5", "task-10"],
    sprints: ["sprint-1", "sprint-2", "sprint-4"],
    deadline: new Date(2025, 11, 31),
  },
  {
    id: "project-2",
    name: "E-commerce Platform",
    description: "Next-gen online shopping platform",
    ...baseEntityFields,
    employees: ["emp-1", "emp-3", "emp-4"],
    tasks: ["task-6", "task-7", "task-8", "task-9"],
    sprints: ["sprint-3"],
    deadline: new Date(2025, 8, 15),
  },
];

// Now create placeholders for tasks and sprints
export const mockSprints: Sprint[] = [];
export const mockTasks: Task[] = [];

// Initialize sprints (these need Project and Employee references)
const sprintData = [
  {
    id: "sprint-1",
    projectId: "project-1",
    assignedMemberIds: ["emp-1", "emp-2"],
    scrumMasterId: "emp-1",
    start_date: new Date(2025, 4, 1),
    end_date: new Date(2025, 4, 14),
    status: SprintStatus.Completed,
    total_story_points: 20,
    completed_story_points: 18,
  },
  {
    id: "sprint-2",
    projectId: "project-1",
    assignedMemberIds: ["emp-1", "emp-3"],
    scrumMasterId: "emp-1",
    start_date: new Date(2025, 5, 1),
    end_date: new Date(2025, 5, 14),
    status: SprintStatus.Active,
    total_story_points: 15,
    completed_story_points: 5,
  },
  {
    id: "sprint-3",
    projectId: "project-2",
    assignedMemberIds: ["emp-3", "emp-4"],
    scrumMasterId: "emp-3",
    start_date: new Date(2025, 6, 1),
    end_date: new Date(2025, 6, 14),
    status: SprintStatus.Planned,
    total_story_points: 25,
    completed_story_points: 0,
  },
  {
    id: "sprint-4",
    projectId: "project-1",
    assignedMemberIds: ["emp-1", "emp-2", "emp-3"],
    scrumMasterId: "emp-3",
    start_date: new Date(2025, 7, 1),
    end_date: new Date(2025, 7, 14),
    status: SprintStatus.Planned,
    total_story_points: 30,
    completed_story_points: 0,
  },
];

// Initialize mock sprints with proper references
sprintData.forEach((data) => {
  const project = mockProjects.find((p) => p.id === data.projectId);
  const scrumMaster = mockEmployees.find((e) => e.id === data.scrumMasterId);
  const assignedMembers = data.assignedMemberIds
    .map((id) => mockEmployees.find((e) => e.id === id))
    .filter(Boolean) as Employee[];

  if (project && scrumMaster) {
    // Create sprint with proper references
    const sprint: Sprint = {
      id: data.id,
      ...baseEntityFields,
      project, // Object reference
      assigned_members: assignedMembers, // Array of object references
      tasks: [], // Will be populated later
      scrum_master: scrumMaster, // Object reference
      start_date: data.start_date,
      end_date: data.end_date,
      status: data.status,
      total_story_points: data.total_story_points,
      completed_story_points: data.completed_story_points,
      historical_state: [],
    };

    mockSprints.push(sprint);
  }
});

// Initialize task data (needs Sprint and Project references)
const taskData = [
  {
    id: "task-1",
    problem_statement: "Implement user authentication",
    description: "Create login functionality with OAuth2 integration",
    type: TaskType.STORY,
    priority: TaskPriority.P1,
    severity: TaskSeverity.HIGH,
    status: TaskWorkflowStatus.DONE,
    story_points: 8,
    estimated_hours: 16,
    actual_hours: 14,
    projectId: "project-1",
    sprintId: "sprint-1",
    assigneeId: "emp-1",
    deadline: new Date(2025, 4, 14),
  },
  {
    id: "task-2",
    problem_statement: "Fix password validation bug",
    description: "Password special characters not being recognized",
    type: TaskType.BUG,
    priority: TaskPriority.P2,
    severity: TaskSeverity.CRITICAL,
    status: TaskWorkflowStatus.DONE,
    story_points: 3,
    estimated_hours: 4,
    actual_hours: 3,
    projectId: "project-1",
    sprintId: "sprint-1",
    assigneeId: "emp-2",
    deadline: new Date(2025, 4, 14),
  },
  {
    id: "task-3",
    problem_statement: "Implement task sorting",
    description: "Add drag-and-drop task prioritization",
    type: TaskType.STORY,
    priority: TaskPriority.P2,
    severity: TaskSeverity.MEDIUM,
    status: TaskWorkflowStatus.IN_PROGRESS,
    story_points: 5,
    estimated_hours: 8,
    actual_hours: 4,
    projectId: "project-1",
    sprintId: "sprint-2",
    assigneeId: "emp-1",
    deadline: new Date(2025, 5, 14),
  },
  {
    id: "task-4",
    problem_statement: "Mobile view optimization",
    description: "Improve responsive design for mobile devices",
    type: TaskType.TASK,
    priority: TaskPriority.P3,
    severity: TaskSeverity.LOW,
    status: TaskWorkflowStatus.SELECTED,
    story_points: 5,
    estimated_hours: 6,
    actual_hours: 0,
    projectId: "project-1",
    sprintId: "sprint-2",
    assigneeId: "emp-3",
    deadline: new Date(2025, 5, 14),
  },
  {
    id: "task-5",
    problem_statement: "Database optimization",
    description: "Optimize SQL queries for better performance",
    type: TaskType.TASK,
    priority: TaskPriority.P4,
    severity: TaskSeverity.MEDIUM,
    status: TaskWorkflowStatus.BACKLOG,
    story_points: 8,
    estimated_hours: 12,
    actual_hours: 0,
    projectId: "project-1",
    sprintId: "sprint-4",
    assigneeId: "emp-3",
    deadline: new Date(2025, 7, 15),
  },
  {
    id: "task-6",
    problem_statement: "Product page UI development",
    description: "Create responsive product page template",
    type: TaskType.STORY,
    priority: TaskPriority.P1,
    severity: TaskSeverity.HIGH,
    status: TaskWorkflowStatus.IN_PROGRESS,
    story_points: 13,
    estimated_hours: 24,
    actual_hours: 12,
    projectId: "project-2",
    sprintId: "sprint-3",
    assigneeId: "emp-4",
    deadline: new Date(2025, 6, 14),
  },
  {
    id: "task-7",
    problem_statement: "Payment gateway integration",
    description: "Integrate Stripe payment processing",
    type: TaskType.STORY,
    priority: TaskPriority.P2,
    severity: TaskSeverity.CRITICAL,
    status: TaskWorkflowStatus.SELECTED,
    story_points: 8,
    estimated_hours: 16,
    actual_hours: 0,
    projectId: "project-2",
    sprintId: "sprint-3",
    assigneeId: "emp-3",
    deadline: new Date(2025, 6, 14),
  },
  {
    id: "task-8",
    problem_statement: "Shopping cart bug",
    description: "Items disappearing from cart after refresh",
    type: TaskType.BUG,
    priority: TaskPriority.P1,
    severity: TaskSeverity.HIGH,
    status: TaskWorkflowStatus.BACKLOG,
    story_points: 5,
    estimated_hours: 6,
    actual_hours: 0,
    projectId: "project-2",
    deadline: new Date(2025, 6, 30),
  },
  {
    id: "task-9",
    problem_statement: "User profile management",
    description: "Create profile editing interface",
    type: TaskType.TASK,
    priority: TaskPriority.P3,
    severity: TaskSeverity.MEDIUM,
    status: TaskWorkflowStatus.BACKLOG,
    story_points: 8,
    estimated_hours: 10,
    actual_hours: 0,
    projectId: "project-2",
    deadline: new Date(2025, 6, 30),
  },
  {
    id: "task-10",
    problem_statement: "Implementation of data visualization",
    description: "Develop interactive charts and data visualization components",
    type: TaskType.STORY,
    priority: TaskPriority.P2,
    severity: TaskSeverity.MEDIUM,
    status: TaskWorkflowStatus.SELECTED,
    story_points: 13,
    estimated_hours: 20,
    actual_hours: 0,
    projectId: "project-1",
    sprintId: "sprint-4",
    assigneeId: "emp-2",
    deadline: new Date(2025, 7, 14),
  },
];

// Initialize tasks with proper references to projects and sprints
taskData.forEach((data) => {
  const project = mockProjects.find((p) => p.id === data.projectId);
  const parentSprint = data.sprintId
    ? mockSprints.find((s) => s.id === data.sprintId)
    : undefined;

  if (project) {
    // Create task with proper references
    const task: Task = {
      id: data.id,
      ...baseEntityFields,
      problem_statement: data.problem_statement,
      description: data.description,
      type: data.type,
      priority: data.priority,
      severity: data.severity,
      status: data.status,
      story_points: data.story_points,
      estimated_hours: data.estimated_hours,
      actual_hours: data.actual_hours,
      project, // Object reference
      associated_files: [],
      deadline: data.deadline,
      pre_requisite_tasks: [],
      dependent_tasks: [],
      blocked: false,
      status_change_events: [],
      comments: [],
      files: [],
    };

    // Add parent sprint if exists
    if (parentSprint) {
      task.parent_sprint = parentSprint;

      // Add task to sprint's tasks array
      parentSprint.tasks.push(task);
    }

    mockTasks.push(task);

    // Add task to project's tasks array
    project.tasks.push(task.id);
  }
});

// Initialize session storage
if (
  typeof window !== "undefined" &&
  !sessionStorage.getItem("selectedProject")
) {
  sessionStorage.setItem(
    "selectedProject",
    JSON.stringify({ id: mockProjects[0].id })
  );
}

// Initialize data in localStorage
// Check if data exists in localStorage or use the default mockData
const initializeDataFromStorage = () => {
  if (typeof window !== "undefined") {
    try {
      // Check if we have data in localStorage
      const storedTasks = localStorage.getItem("mockTasks");
      const storedProjects = localStorage.getItem("mockProjects");
      const storedEmployees = localStorage.getItem("mockEmployees");
      const storedSprints = localStorage.getItem("mockSprints");

      if (storedTasks && storedProjects && storedEmployees && storedSprints) {
        console.log("Found data in localStorage, initializing from storage");

        // Clear existing arrays without reassigning (to maintain references)
        mockTasks.length = 0;
        mockProjects.length = 0;
        mockEmployees.length = 0;
        mockSprints.length = 0;

        // Parse stored data
        const parsedTasks = JSON.parse(storedTasks);
        const parsedProjects = JSON.parse(storedProjects);
        const parsedEmployees = JSON.parse(storedEmployees);
        const parsedSprints = JSON.parse(storedSprints);

        // Push data back into arrays
        parsedProjects.forEach((project: Project) =>
          mockProjects.push(project)
        );
        parsedEmployees.forEach((employee: Employee) =>
          mockEmployees.push(employee)
        );
        parsedSprints.forEach((sprint: Sprint) => mockSprints.push(sprint));
        parsedTasks.forEach((task: Task) => mockTasks.push(task));

        // Fix circular references
        fixReferences();

        console.log(
          "Data initialized from localStorage:",
          `${mockTasks.length} tasks, ${mockProjects.length} projects, ` +
            `${mockEmployees.length} employees, ${mockSprints.length} sprints`
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
      return false;
    }
  }
  return false;
};

// Fix references between objects (circular references can't be serialized directly)
const fixReferences = () => {
  // Fix task references
  mockTasks.forEach((task) => {
    // Convert date strings back to Date objects
    if (typeof task.created_at === "string")
      task.created_at = new Date(task.created_at);
    if (typeof task.updated_at === "string")
      task.updated_at = new Date(task.updated_at);
    if (typeof task.deadline === "string")
      task.deadline = new Date(task.deadline);

    // Find and set project reference
    const projectId =
      typeof task.project === "string" ? task.project : task.project?.id;
    if (projectId) {
      task.project = findProjectById(projectId) || task.project;
    }

    // Find and set sprint reference (parent_sprint)
    const sprintId =
      typeof task.parent_sprint === "string"
        ? task.parent_sprint
        : task.parent_sprint?.id;
    if (sprintId) {
      task.parent_sprint = findSprintById(sprintId) || task.parent_sprint;
    }

    // Fix pre-requisite tasks and dependent tasks references
    if (task.pre_requisite_tasks?.length) {
      task.pre_requisite_tasks = task.pre_requisite_tasks
        .map((t) => (typeof t === "string" ? findTaskById(t) || t : t))
        .filter(Boolean) as Task[];
    }

    if (task.dependent_tasks?.length) {
      task.dependent_tasks = task.dependent_tasks
        .map((t) => (typeof t === "string" ? findTaskById(t) || t : t))
        .filter(Boolean) as Task[];
    }
  });

  // Fix sprint references
  mockSprints.forEach((sprint) => {
    // Convert date strings back to Date objects
    if (typeof sprint.created_at === "string")
      sprint.created_at = new Date(sprint.created_at);
    if (typeof sprint.updated_at === "string")
      sprint.updated_at = new Date(sprint.updated_at);
    if (typeof sprint.start_date === "string")
      sprint.start_date = new Date(sprint.start_date);
    if (typeof sprint.end_date === "string")
      sprint.end_date = new Date(sprint.end_date);

    // Fix project reference
    const projectId =
      typeof sprint.project === "string" ? sprint.project : sprint.project?.id;
    if (projectId) {
      sprint.project = findProjectById(projectId) || sprint.project;
    }

    // Fix scrum master reference
    const scrumMasterId =
      typeof sprint.scrum_master === "string"
        ? sprint.scrum_master
        : sprint.scrum_master?.id;
    if (scrumMasterId) {
      sprint.scrum_master =
        findEmployeeById(scrumMasterId) || sprint.scrum_master;
    }

    // Fix assigned members references
    if (sprint.assigned_members?.length) {
      sprint.assigned_members = sprint.assigned_members
        .map((m) => (typeof m === "string" ? findEmployeeById(m) || m : m))
        .filter(Boolean) as Employee[];
    }

    // Fix tasks references
    if (sprint.tasks?.length) {
      sprint.tasks = sprint.tasks
        .map((t) => (typeof t === "string" ? findTaskById(t) || t : t))
        .filter(Boolean) as Task[];
    }
  });

  // Fix project and employee dates
  mockProjects.forEach((project) => {
    if (typeof project.created_at === "string")
      project.created_at = new Date(project.created_at);
    if (typeof project.updated_at === "string")
      project.updated_at = new Date(project.updated_at);
    if (typeof project.deadline === "string")
      project.deadline = new Date(project.deadline);
  });
};

// Function to prepare an object for serialization (replace circular references with IDs)
const prepareForSerialization = <T extends { id: string }>(obj: T): any => {
  const result: any = { ...obj };

  // Handle Task objects
  if ("problem_statement" in result) {
    if (result.project && typeof result.project !== "string") {
      result.project = result.project.id;
    }
    if (result.parent_sprint && typeof result.parent_sprint !== "string") {
      result.parent_sprint = result.parent_sprint.id;
    }
    if (result.pre_requisite_tasks?.length) {
      result.pre_requisite_tasks = result.pre_requisite_tasks.map((t: any) =>
        typeof t === "string" ? t : t.id
      );
    }
    if (result.dependent_tasks?.length) {
      result.dependent_tasks = result.dependent_tasks.map((t: any) =>
        typeof t === "string" ? t : t.id
      );
    }
  }

  // Handle Sprint objects
  if ("total_story_points" in result) {
    if (result.project && typeof result.project !== "string") {
      result.project = result.project.id;
    }
    if (result.scrum_master && typeof result.scrum_master !== "string") {
      result.scrum_master = result.scrum_master.id;
    }
    if (result.assigned_members?.length) {
      result.assigned_members = result.assigned_members.map((m: any) =>
        typeof m === "string" ? m : m.id
      );
    }
    if (result.tasks?.length) {
      result.tasks = result.tasks.map((t: any) =>
        typeof t === "string" ? t : t.id
      );
    }
  }

  // Handle date objects
  Object.keys(result).forEach((key) => {
    if (result[key] instanceof Date) {
      result[key] = result[key].toISOString();
    }
  });

  return result;
};

// Save all mockdata to localStorage
export const saveAllData = () => {
  if (typeof window !== "undefined") {
    try {
      // Prepare data for serialization (avoid circular references)
      const serializedProjects = mockProjects.map((p) =>
        prepareForSerialization(p)
      );
      const serializedEmployees = mockEmployees.map((e) =>
        prepareForSerialization(e)
      );
      const serializedSprints = mockSprints.map((s) =>
        prepareForSerialization(s)
      );
      const serializedTasks = mockTasks.map((t) => prepareForSerialization(t));

      // Save to localStorage
      localStorage.setItem("mockProjects", JSON.stringify(serializedProjects));
      localStorage.setItem(
        "mockEmployees",
        JSON.stringify(serializedEmployees)
      );
      localStorage.setItem("mockSprints", JSON.stringify(serializedSprints));
      localStorage.setItem("mockTasks", JSON.stringify(serializedTasks));

      console.log("All data saved to localStorage");
      return true;
    } catch (error) {
      console.error("Error saving data to localStorage:", error);
      return false;
    }
  }
  return false;
};

// Function to add a task and update storage
export const addTask = (task: Task) => {
  // Check for duplicate task ID
  if (mockTasks.some((t) => t.id === task.id)) {
    console.warn(`Task with ID ${task.id} already exists. Generating new ID.`);
    // Generate a unique ID that doesn't already exist
    let newId = `TASK-${mockTasks.length + 1}`;
    while (mockTasks.some((t) => t.id === newId)) {
      newId = `TASK-${parseInt(newId.split("-")[1]) + 1}`;
    }
    task.id = newId;
  }

  mockTasks.push(task);
  console.log("Added task to mockTasks:", task.id);
  saveAllData();
  return task;
};

// Function to update a task
export const updateTask = (taskId: string, updates: Partial<Task>) => {
  const taskIndex = mockTasks.findIndex((t) => t.id === taskId);
  if (taskIndex !== -1) {
    mockTasks[taskIndex] = { ...mockTasks[taskIndex], ...updates };
    saveAllData();
    return mockTasks[taskIndex];
  }
  return null;
};

// Function to delete a task
export const deleteTask = (taskId: string) => {
  const taskIndex = mockTasks.findIndex((t) => t.id === taskId);
  if (taskIndex !== -1) {
    mockTasks.splice(taskIndex, 1);
    saveAllData();
    return true;
  }
  return false;
};

// Only initialize from taskData if not loaded from localStorage
// This needs to be called after the functions are defined
export const initializeMockData = () => {
  // Skip initialization if already loaded from storage
  if (initializeDataFromStorage()) {
    return;
  }

  // Otherwise, clear arrays and initialize from the taskData array
  console.log("Initializing from default mock data");

  // Clear all arrays to prevent duplicates during development reloads
  mockTasks.length = 0;
  mockSprints.length = 0; // Also clear sprints to avoid duplicates

  // Initialize sprints first (necessary for task references)
  sprintData.forEach((data) => {
    const project = mockProjects.find((p) => p.id === data.projectId);
    const scrumMaster = mockEmployees.find((e) => e.id === data.scrumMasterId);
    const assignedMembers = data.assignedMemberIds
      .map((id) => mockEmployees.find((e) => e.id === id))
      .filter(Boolean) as Employee[];

    if (project && scrumMaster) {
      // Create sprint with proper references
      const sprint: Sprint = {
        id: data.id,
        ...baseEntityFields,
        project, // Object reference
        assigned_members: assignedMembers, // Array of object references
        tasks: [], // Will be populated later
        scrum_master: scrumMaster, // Object reference
        start_date: data.start_date,
        end_date: data.end_date,
        status: data.status,
        total_story_points: data.total_story_points,
        completed_story_points: data.completed_story_points,
        historical_state: [],
      };

      mockSprints.push(sprint);
    }
  });

  // Initialize tasks with proper references to projects and sprints
  const taskIds = new Set(); // Track task IDs to prevent duplicates

  taskData.forEach((data) => {
    // Skip if task ID already exists
    if (taskIds.has(data.id)) {
      console.warn(`Skipping duplicate task ID: ${data.id}`);
      return;
    }

    taskIds.add(data.id);

    const project = mockProjects.find((p) => p.id === data.projectId);
    const parentSprint = data.sprintId
      ? mockSprints.find((s) => s.id === data.sprintId)
      : undefined;

    if (project) {
      // Create task with proper references
      const task: Task = {
        id: data.id,
        ...baseEntityFields,
        problem_statement: data.problem_statement,
        description: data.description,
        type: data.type,
        priority: data.priority,
        severity: data.severity,
        status: data.status,
        story_points: data.story_points,
        estimated_hours: data.estimated_hours,
        actual_hours: data.actual_hours,
        project, // Object reference
        associated_files: [],
        deadline: data.deadline,
        pre_requisite_tasks: [],
        dependent_tasks: [],
        blocked: false,
        status_change_events: [],
        comments: [],
        files: [],
      };

      // Add parent sprint if exists
      if (parentSprint) {
        task.parent_sprint = parentSprint;
        // Add task to sprint's tasks array
        parentSprint.tasks.push(task);
      }

      mockTasks.push(task);

      // Add task ID to project's tasks array (only if not already present)
      if (!project.tasks.includes(task.id)) {
        project.tasks.push(task.id);
      }
    }
  });

  // Save the default data to localStorage
  saveAllData();
};

// Call initializeMockData when the module is first loaded, but make sure it only runs once
if (typeof window !== "undefined" && !window.MOCK_DATA_INITIALIZED) {
  window.MOCK_DATA_INITIALIZED = true;
  initializeMockData();
}

// API functions
export const fetchSprintsByProject = async (
  projectId: string
): Promise<Sprint[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const project = mockProjects.find((p) => p.id === projectId);
      if (!project) return resolve([]);

      const sprints = mockSprints.filter(
        (sprint) => sprint.project.id === projectId
      );
      resolve(sprints);
    }, 500);
  });
};

export const fetchBacklogTasksByProject = async (
  projectId: string
): Promise<Task[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const project = mockProjects.find((p) => p.id === projectId);
      if (!project) return resolve([]);

      // Find tasks that belong to this project but aren't assigned to any sprint
      const tasks = mockTasks.filter(
        (task) => task.project.id === projectId && !task.parent_sprint
      );

      resolve(tasks);
    }, 500);
  });
};

export const fetchProjectById = async (
  projectId: string
): Promise<Project | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockProjects.find((p) => p.id === projectId) || null);
    }, 500);
  });
};

export const fetchEmployeesByProject = async (
  projectId: string
): Promise<Employee[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const project = mockProjects.find((p) => p.id === projectId);
      if (!project) return resolve([]);

      const employees = project.employees
        .map((empId) => mockEmployees.find((e) => e.id === empId))
        .filter(Boolean) as Employee[];

      resolve(employees);
    }, 500);
  });
};

// Sprint handlers
export const handleCreateSprint = async (
  projectId: string,
  sprintData: Omit<Sprint, "id">
): Promise<Sprint | null> => {
  try {
    const project = mockProjects.find((p) => p.id === projectId);
    if (!project) return null;

    // Create new sprint with proper ID
    const newSprintId = `sprint-${Date.now()}`;

    // Create sprint object
    const newSprint: Sprint = {
      ...sprintData,
      id: newSprintId,
      ...baseEntityFields,
      project, // Use the project object reference
      tasks: [],
      total_story_points: 0,
      completed_story_points: 0,
      historical_state: [],
    };

    // Add sprint to collection
    mockSprints.push(newSprint);

    // Add sprint ID to project's sprints array
    project.sprints.push(newSprintId);

    return newSprint;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Add task to sprint
export const handleAddTaskToSprint = async (
  taskId: string,
  sprintId: string
): Promise<boolean> => {
  try {
    const task = mockTasks.find((t) => t.id === taskId);
    const sprint = mockSprints.find((s) => s.id === sprintId);

    if (!task || !sprint) {
      return false;
    }

    // Check if task already in this sprint
    if (task.parent_sprint === sprint) {
      return true; // Already there, consider it a success
    }

    // If task was in another sprint, remove it from there
    if (task.parent_sprint) {
      const oldSprint = task.parent_sprint;
      oldSprint.tasks = oldSprint.tasks.filter((t) => t.id !== taskId);

      // Update story points for old sprint
      oldSprint.total_story_points -= task.story_points;
      if (task.status === TaskWorkflowStatus.DONE) {
        oldSprint.completed_story_points -= task.story_points;
      }
    }

    // Add to new sprint
    task.parent_sprint = sprint;
    sprint.tasks.push(task);

    // Update story points for new sprint
    sprint.total_story_points += task.story_points;
    if (task.status === TaskWorkflowStatus.DONE) {
      sprint.completed_story_points += task.story_points;
    }

    return true;
  } catch (error) {
    console.error("Error adding task to sprint:", error);
    return false;
  }
};
