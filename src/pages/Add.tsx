import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../components/components/ui/button";
import { Label } from "../components/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../components/components/ui/select";
import { Textarea } from "../components/components/ui/textarea";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "../components/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/components/ui/popover";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import MarkdownEditor from "../components/Input/MarkdownEditor";
import { useNavigate } from "react-router-dom";

import {
  IssueType,
  IssuePriority,
  IssueTypeCopy,
  IssuePriorityCopy,
  TaskStatus,
} from "../data/Issue";

// Import mock data
import {
  mockProjects,
  mockEmployees,
  mockSprints,
  mockTasks,
  findProjectById,
  findEmployeeById,
  addTask,
  saveAllData,
} from "../data/mockdata";
import {
  TaskWorkflowStatus,
  TaskPriority,
  TaskType,
  TaskSeverity,
  Task,
  SprintStatus,
  Privilege,
} from "../data/Types";

// Base entity fields for new entities
const baseEntityFields = {
  created_at: new Date(),
  updated_at: new Date(),
  required_action_privilege: Privilege.TeamMember,
  updated_by: undefined as string | undefined,
};

const formSchema = z.object({
  projectId: z.string().min(1, "Project is required"),
  assigneeId: z.string().min(1, "Assignee is required"),
  issueType: z.nativeEnum(IssueType, {
    errorMap: () => ({ message: "Please select an issue type" }),
  }),
  priority: z.nativeEnum(IssuePriority, {
    errorMap: () => ({ message: "Please select a priority" }),
  }),
  severity: z.string().min(1, "Please select a severity"),
  deadline: z.date().refine((date) => date > new Date(), {
    message: "Deadline must be in the future",
  }),
  description: z.string().min(10, "Description must be at least 10 characters"),
  storyPoints: z.number().min(1, "Story points must be at least 1"),
  estimatedHours: z.number().min(1, "Estimated hours must be at least 1"),
  actualHours: z.number().optional(),
  status: z.nativeEnum(TaskStatus),
  blocked: z.boolean().default(false),
  blockedReason: z.string().optional(),
  preRequisiteTasks: z.array(z.string()).optional(),
  dependentTasks: z.array(z.string()).optional(),
  attachedFiles: z.array(z.instanceof(File)).optional(),
  comments: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Updated to use mock data instead of API calls
const fetchProjects = async () => {
  return mockProjects;
};

const fetchEmployees = async () => {
  return mockEmployees;
};

export const Add = () => {
  return (
    <div className="w-full h-screen p-16 overflow-auto">
      <AddTaskForm />
    </div>
  );
};

const AddTaskForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      blocked: false,
      storyPoints: 1,
      estimatedHours: 1,
    },
  });

  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);

  // This function will manually submit the form
  const submitForm = async () => {
    setSubmitting(true);
    console.log("Starting form submission");

    // Set a timeout to prevent infinite hanging
    const timeout = setTimeout(() => {
      console.error("Form submission timed out after 10 seconds");
      setSubmitting(false);
      alert("Form submission timed out. Please try again.");
    }, 10000);

    try {
      // Use handleSubmit with a validation callback
      const onValid = async (formValues: FormValues) => {
        console.log("Form data is valid:", formValues);

        try {
          // Find the project
          const project = findProjectById(formValues.projectId);
          if (!project) {
            console.error("Project not found");
            alert("Project not found. Please select a valid project.");
            return;
          }

          console.log("Found project:", project);

          // Find the assignee (if provided)
          const assignee = formValues.assigneeId
            ? findEmployeeById(formValues.assigneeId)
            : null;
          console.log("Assignee:", assignee);

          // Generate a new task ID with timestamp to ensure uniqueness
          const taskId = `TASK-${Date.now()}-${Math.floor(
            Math.random() * 1000
          )}`;
          console.log("Generated task ID:", taskId);

          // Map form enums to Task enums
          const mapStatus = (status: TaskStatus): TaskWorkflowStatus => {
            console.log("Mapping status:", status);
            switch (status) {
              case TaskStatus.BACKLOG:
                return TaskWorkflowStatus.BACKLOG;
              case TaskStatus.SELECTED:
                return TaskWorkflowStatus.SELECTED;
              case TaskStatus.IN_PROGRESS:
                return TaskWorkflowStatus.IN_PROGRESS;
              case TaskStatus.DONE:
                return TaskWorkflowStatus.DONE;
              default:
                return TaskWorkflowStatus.BACKLOG; // Default
            }
          };

          const mapType = (type: IssueType): TaskType => {
            console.log("Mapping type:", type);
            switch (type) {
              case IssueType.TASK:
                return TaskType.TASK;
              case IssueType.BUG:
                return TaskType.BUG;
              case IssueType.STORY:
                return TaskType.STORY;
              default:
                return TaskType.TASK; // Default
            }
          };

          const mapPriority = (priority: IssuePriority): TaskPriority => {
            console.log("Mapping priority:", priority);
            switch (priority) {
              case IssuePriority.P1:
                return TaskPriority.P1;
              case IssuePriority.P2:
                return TaskPriority.P2;
              case IssuePriority.P3:
                return TaskPriority.P3;
              case IssuePriority.P4:
                return TaskPriority.P4;
              case IssuePriority.P5:
                return TaskPriority.P5;
              default:
                return TaskPriority.P3; // Default
            }
          };

          // Create the new task
          const newTask: Task = {
            id: taskId,
            problem_statement: formValues.description || "New Task",
            description: formValues.description || "",
            type: mapType(formValues.issueType),
            priority: mapPriority(formValues.priority),
            severity: formValues.severity as TaskSeverity,
            status: mapStatus(formValues.status),
            story_points: formValues.storyPoints,
            estimated_hours: formValues.estimatedHours,
            actual_hours: formValues.actualHours || 0,
            deadline: formValues.deadline,
            blocked: formValues.blocked,
            blocked_reason: formValues.blockedReason || "",
            project: project,
            associated_files: [],
            pre_requisite_tasks: [],
            dependent_tasks: [],
            status_change_events: [],
            comments: [],
            files: [],
            ...baseEntityFields,
          };

          console.log("Created new task:", newTask);

          // Add the task to mockTasks using the addTask function
          addTask(newTask);
          console.log("Task added to mockTasks successfully");

          // Add the task to the project's tasks if not already there
          if (!project.tasks.includes(taskId)) {
            project.tasks.push(taskId);
            console.log(`Added task ID ${taskId} to project ${project.id}`);
          }

          // If there's an assignee, add the task to their assigned tasks
          if (assignee) {
            if (!assignee.assigned_tasks.includes(taskId)) {
              assignee.assigned_tasks.push(taskId);
              console.log(`Added task ID ${taskId} to assignee ${assignee.id}`);
            }
          }

          // If task status is not BACKLOG, add it to the active sprint for the project
          if (
            formValues.status !== TaskStatus.BACKLOG &&
            project.sprints.length > 0
          ) {
            // Find active sprint
            const activeSprint = mockSprints.find(
              (s) =>
                s.project.id === project.id && s.status === SprintStatus.Active
            );
            if (activeSprint) {
              // Add task to the sprint
              activeSprint.tasks.push(newTask);
              newTask.parent_sprint = activeSprint;

              // Update story points
              activeSprint.total_story_points += newTask.story_points;
              console.log(`Added task to active sprint ${activeSprint.id}`);
            }
          }

          // Save all data to local storage
          console.log("Saving all data to localStorage");
          saveAllData();

          // Alert the user of success
          alert("Task created successfully!");
          console.log("Task creation complete, navigating to dashboard");

          // Navigate back to the dashboard
          navigate("/dashboard");
        } catch (error) {
          console.error("Error in task creation:", error);
          alert("Error creating task: " + String(error));
        }
      };

      const onInvalid = (errors: any) => {
        console.error("Form validation failed:", errors);
        alert(
          "Please fill out all required fields correctly before submitting."
        );
      };

      // Execute the form validation
      await handleSubmit(onValid, onInvalid)();
    } catch (error) {
      console.error("Error in form submission:", error);
      alert("Failed to submit form: " + String(error));
    } finally {
      clearTimeout(timeout);
      setSubmitting(false);
    }
  };

  const [projects, setProjects] = useState<typeof mockProjects>([]);
  const [employees, setEmployees] = useState<typeof mockEmployees>([]);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    // Load mock data
    fetchProjects().then((projects) => setProjects(projects));
    fetchEmployees().then((employees) => setEmployees(employees));
  }, []);

  return (
    <Card className="bg-gray-900 text-white max-w-[1200px] min-w-[700px] mx-auto p-4 border-gray-700">
      <CardHeader>
        <CardTitle className="text-2xl">Create Task</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="flex gap-4">
            {/* Project Selection */}
            <div>
              <Label className="mb-2">Project</Label>
              <Select onValueChange={(value) => setValue("projectId", value)}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select Project" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  {projects.map((proj) => (
                    <SelectItem key={proj.id} value={proj.id}>
                      {proj.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.projectId && (
                <p className="text-red-500 text-sm">
                  {errors.projectId.message}
                </p>
              )}
            </div>

            {/* Assignee Selection */}
            <div>
              <Label className="mb-2">Assignee</Label>
              <Select onValueChange={(value) => setValue("assigneeId", value)}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select Assignee" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.assigneeId && (
                <p className="text-red-500 text-sm">
                  {errors.assigneeId.message}
                </p>
              )}
            </div>
          </div>

          {/* Issue Type & Priority */}
          <div className="flex gap-4">
            <div>
              <Label className="mb-2">Issue Type</Label>
              <Select
                onValueChange={(value) =>
                  setValue("issueType", value as IssueType)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Issue Type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(IssueType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {IssueTypeCopy[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-2">Priority</Label>
              <Select
                onValueChange={(value) =>
                  setValue("priority", value as IssuePriority)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Priority" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(IssuePriority).map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {IssuePriorityCopy[priority]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Severity Dropdown */}
            <div>
              <Label className="mb-2">Severity</Label>
              <Select
                onValueChange={(value) => setValue("severity", value as string)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Severity" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(TaskSeverity).map((severity) => (
                    <SelectItem key={severity} value={severity}>
                      {severity}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Deadline */}
            <div>
              <Label className="mb-2">Deadline</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full flex justify-between items-center bg-black hover:bg-black hover:text-white"
                  >
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                    <CalendarIcon className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 bg-black text-white"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(selectedDate) => {
                      if (selectedDate) {
                        setDate(selectedDate);
                        setValue("deadline", selectedDate, {
                          shouldValidate: true,
                        });
                      }
                    }}
                    disabled={(d) => d <= new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.deadline && (
                <p className="text-red-500 text-sm">
                  {errors.deadline.message}
                </p>
              )}
            </div>
            {/* Status */}
            <div>
              <Label className="mb-2">Status</Label>
              <Select
                onValueChange={(value) =>
                  setValue("status", value as TaskStatus)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(TaskStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="text-white">
            <Label className="mb-2">Description</Label>
            <MarkdownEditor
              defaultValue={watch("description")}
              onChange={(content) =>
                setValue("description", content, { shouldValidate: true })
              }
            />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Story Points and Estimated Hours */}
          <div className="flex gap-4">
            <div>
              <Label className="mb-2">Story Points</Label>
              <input
                type="number"
                min="1"
                className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
                onChange={(e) =>
                  setValue("storyPoints", parseInt(e.target.value))
                }
                defaultValue={1}
              />
              {errors.storyPoints && (
                <p className="text-red-500 text-sm">
                  {errors.storyPoints.message}
                </p>
              )}
            </div>
            <div>
              <Label className="mb-2">Estimated Hours</Label>
              <input
                type="number"
                min="1"
                className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
                onChange={(e) =>
                  setValue("estimatedHours", parseInt(e.target.value))
                }
                defaultValue={1}
              />
              {errors.estimatedHours && (
                <p className="text-red-500 text-sm">
                  {errors.estimatedHours.message}
                </p>
              )}
            </div>
          </div>

          {/* Blocked Checkbox */}
          <div className="flex">
            <input type="checkbox" {...register("blocked")} id="blocked" />
            <Label htmlFor="blocked" className="ml-2">
              Blocked
            </Label>
          </div>

          {/* Blocked Reason */}
          {watch("blocked") && (
            <div>
              <Label className="mb-2">Blocked Reason</Label>
              <Textarea
                {...register("blockedReason")}
                className="w-full"
                placeholder="Enter reason..."
              />
            </div>
          )}

          {/* Comments */}
          <div>
            <Label className="mb-2">Comments</Label>
            <Textarea
              {...register("comments")}
              className="w-full"
              placeholder="Additional comments..."
            />
          </div>

          {/* Submit Button */}
          <Button
            type="button"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            disabled={submitting}
            onClick={submitForm}
          >
            {submitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating...
              </span>
            ) : (
              "Create Task"
            )}
          </Button>

          {/* Form Status Message */}
          {submitting && (
            <div className="mt-4 p-3 bg-blue-100 text-blue-800 rounded">
              Creating task... Please wait while we save your task data.
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};
