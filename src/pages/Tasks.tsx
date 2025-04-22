import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../components/components/ui/card";
import { Button } from "../components/components/ui/button";
import { Badge } from "../components/components/ui/badge";
import { Input } from "../components/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/components/ui/tabs";
import { Separator } from "../components/components/ui/separator";
import {
  Search,
  Filter,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  BarChart,
  ArrowUpDown,
} from "lucide-react";
import {
  mockTasks,
  mockEmployees,
  mockProjects,
  mockSprints,
  handleAddTaskToSprint,
  saveAllData,
} from "../data/mockdata";
import {
  Task,
  TaskWorkflowStatus,
  TaskPriority,
  TaskSeverity,
  TaskType,
} from "../data/Types";

type TasksProps = {};

export const Tasks = ({}: TasksProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<string>("priority");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [refreshKey, setRefreshKey] = useState(0); // Used to force re-renders

  // Refresh function
  const refreshTasks = () => {
    console.log("Refreshing tasks...");
    console.log("Number of tasks in mockTasks:", mockTasks.length);

    // Create a fresh copy of the tasks array, filtering out duplicates
    const taskIds = new Set<string>();
    const uniqueTasks: Task[] = [];

    mockTasks.forEach((task) => {
      if (!taskIds.has(task.id)) {
        taskIds.add(task.id);
        uniqueTasks.push(task);
      }
    });

    console.log(
      `Using ${uniqueTasks.length} unique tasks out of ${mockTasks.length} total tasks`
    );

    // Update state with the fresh data
    setTasks(uniqueTasks);

    // Increment refresh key to force re-render
    setRefreshKey((prev) => prev + 1);
  };

  // Load tasks on mount
  useEffect(() => {
    console.log(
      "Tasks component mounted or refreshKey changed. Loading tasks..."
    );
    console.log("Mock tasks count:", mockTasks.length);

    // Check for and remove duplicate tasks
    const taskIds = new Set<string>();
    const uniqueTasks: Task[] = [];

    mockTasks.forEach((task) => {
      if (!taskIds.has(task.id)) {
        taskIds.add(task.id);
        uniqueTasks.push(task);
      } else {
        console.warn(`Skipping duplicate task with ID: ${task.id}`);
      }
    });

    if (uniqueTasks.length !== mockTasks.length) {
      console.warn(
        `Found ${
          mockTasks.length - uniqueTasks.length
        } duplicate tasks. Using ${uniqueTasks.length} unique tasks.`
      );
    }

    // Add some debugging for task data
    if (uniqueTasks.length > 0) {
      console.log("First task:", uniqueTasks[0]);
      console.log("Project reference:", uniqueTasks[0].project);
      if (uniqueTasks[0].project) {
        console.log("Project name:", uniqueTasks[0].project.name);
      }
    }

    setTasks(uniqueTasks);

    // Also create event listener for storage changes (for cross-tab updates)
    const handleStorageChange = () => {
      console.log("Storage changed, refreshing tasks");
      refreshTasks();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [refreshKey]); // Re-run when refreshKey changes

  useEffect(() => {
    // Apply filtering and sorting whenever filter criteria change
    let result = [...tasks];

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((task) => task.status === statusFilter);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (task) =>
          task.problem_statement.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    result = result.sort((a, b) => {
      let valueA: any;
      let valueB: any;

      // Determine values to compare based on sort field
      switch (sortField) {
        case "priority":
          valueA = a.priority;
          valueB = b.priority;
          break;
        case "severity":
          valueA = a.severity;
          valueB = b.severity;
          break;
        case "story_points":
          valueA = a.story_points;
          valueB = b.story_points;
          break;
        case "status":
          valueA = a.status;
          valueB = b.status;
          break;
        default:
          valueA = a.problem_statement;
          valueB = b.problem_statement;
      }

      // Sort direction
      if (sortDirection === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });

    setFilteredTasks(result);
  }, [tasks, statusFilter, searchQuery, sortField, sortDirection]);

  // Update filteredTasks when tasks change
  useEffect(() => {
    console.log("Tasks changed, updating filtered tasks");
    setFilteredTasks(tasks);
  }, [tasks]);

  // Format date helper
  const formatDate = (date?: Date | string): string => {
    if (!date) return "No date";
    try {
      // Handle both Date objects and string date representations
      const dateObj = date instanceof Date ? date : new Date(date);
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(dateObj);
    } catch (error) {
      console.error("Error formatting date:", date, error);
      return "Invalid date";
    }
  };

  // Helper for task priority display
  const getPriorityLabel = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.P1:
        return {
          label: "P1",
          color: "bg-red-500/20 text-red-400 border-red-500",
        };
      case TaskPriority.P2:
        return {
          label: "P2",
          color: "bg-orange-500/20 text-orange-400 border-orange-500",
        };
      case TaskPriority.P3:
        return {
          label: "P3",
          color: "bg-yellow-500/20 text-yellow-400 border-yellow-500",
        };
      case TaskPriority.P4:
        return {
          label: "P4",
          color: "bg-blue-500/20 text-blue-400 border-blue-500",
        };
      case TaskPriority.P5:
        return {
          label: "P5",
          color: "bg-gray-500/20 text-gray-400 border-gray-500",
        };
    }
  };

  // Helper for task severity display
  const getSeverityLabel = (severity: TaskSeverity) => {
    switch (severity) {
      case TaskSeverity.CRITICAL:
        return {
          label: "Critical",
          color: "bg-red-500/20 text-red-400 border-red-500",
        };
      case TaskSeverity.HIGH:
        return {
          label: "High",
          color: "bg-orange-500/20 text-orange-400 border-orange-500",
        };
      case TaskSeverity.MEDIUM:
        return {
          label: "Medium",
          color: "bg-yellow-500/20 text-yellow-400 border-yellow-500",
        };
      case TaskSeverity.LOW:
        return {
          label: "Low",
          color: "bg-blue-500/20 text-blue-400 border-blue-500",
        };
    }
  };

  // Helper for task status display
  const getStatusLabel = (status: TaskWorkflowStatus) => {
    switch (status) {
      case TaskWorkflowStatus.BACKLOG:
        return {
          label: "Backlog",
          color: "bg-gray-500/20 text-gray-300 border-gray-500",
        };
      case TaskWorkflowStatus.SELECTED:
        return {
          label: "Selected",
          color: "bg-blue-500/20 text-blue-400 border-blue-500",
        };
      case TaskWorkflowStatus.IN_PROGRESS:
        return {
          label: "In Progress",
          color: "bg-yellow-500/20 text-yellow-400 border-yellow-500",
        };
      case TaskWorkflowStatus.DONE:
        return {
          label: "Done",
          color: "bg-green-500/20 text-green-400 border-green-500",
        };
    }
  };

  // Helper for task type display
  const getTypeLabel = (type: TaskType) => {
    switch (type) {
      case TaskType.BUG:
        return {
          label: "Bug",
          color: "bg-red-500/20 text-red-400 border-red-500",
        };
      case TaskType.STORY:
        return {
          label: "Story",
          color: "bg-purple-500/20 text-purple-400 border-purple-500",
        };
      case TaskType.TASK:
        return {
          label: "Task",
          color: "bg-blue-500/20 text-blue-400 border-blue-500",
        };
    }
  };

  // Toggle sort direction when clicking on the same field
  const handleSortChange = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc"); // Default to descending when changing fields
    }
  };

  return (
    <div className="w-full min-h-screen p-8 bg-gray-900 text-white">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Tasks</h1>
            <p className="text-gray-300">
              Manage and track all tasks across projects
            </p>
          </div>
          <Button
            onClick={refreshTasks}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Refresh Tasks
          </Button>
        </div>

        {/* Filters and search bar */}
        <div className="grid grid-cols-12 gap-4 mb-6">
          <div className="col-span-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search tasks..."
                className="pl-10 bg-gray-800 border-gray-700 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="col-span-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectGroup>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value={TaskWorkflowStatus.BACKLOG}>
                    Backlog
                  </SelectItem>
                  <SelectItem value={TaskWorkflowStatus.SELECTED}>
                    Selected
                  </SelectItem>
                  <SelectItem value={TaskWorkflowStatus.IN_PROGRESS}>
                    In Progress
                  </SelectItem>
                  <SelectItem value={TaskWorkflowStatus.DONE}>Done</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-3">
            <Select value={sortField} onValueChange={handleSortChange}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectGroup>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="severity">Severity</SelectItem>
                  <SelectItem value="story_points">Story Points</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tasks table */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl text-white">
              {filteredTasks.length} Tasks{" "}
              {statusFilter !== "all" ? `(${statusFilter})` : ""}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="pb-3 px-4 text-gray-300 font-medium">
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSortChange("type")}
                      >
                        Type
                        {sortField === "type" && (
                          <ArrowUpDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th className="pb-3 px-4 text-gray-300 font-medium">
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSortChange("title")}
                      >
                        Task
                        {sortField === "title" && (
                          <ArrowUpDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th className="pb-3 px-4 text-gray-300 font-medium">
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSortChange("priority")}
                      >
                        Priority
                        {sortField === "priority" && (
                          <ArrowUpDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th className="pb-3 px-4 text-gray-300 font-medium">
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSortChange("severity")}
                      >
                        Severity
                        {sortField === "severity" && (
                          <ArrowUpDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th className="pb-3 px-4 text-gray-300 font-medium">
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSortChange("status")}
                      >
                        Status
                        {sortField === "status" && (
                          <ArrowUpDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th className="pb-3 px-4 text-gray-300 font-medium">
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSortChange("story_points")}
                      >
                        Points
                        {sortField === "story_points" && (
                          <ArrowUpDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th className="pb-3 px-4 text-gray-300 font-medium">
                      Project
                    </th>
                    <th className="pb-3 px-4 text-gray-300 font-medium">
                      Deadline
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Debug information */}
                  {(() => {
                    console.log(
                      "Rendering task list. Filtered tasks:",
                      filteredTasks.length
                    );
                    return null;
                  })()}
                  {filteredTasks.map((task) => {
                    console.log("Rendering task:", task.id, task);
                    const priorityInfo = getPriorityLabel(task.priority);
                    const severityInfo = getSeverityLabel(task.severity);
                    const statusInfo = getStatusLabel(task.status);
                    const typeInfo = getTypeLabel(task.type);

                    return (
                      <tr key={task.id} className="border-b border-gray-700">
                        <td className="py-4 px-4">
                          <Badge className={typeInfo.color}>
                            {typeInfo.label}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-medium text-white">
                            {task.problem_statement}
                          </div>
                          <div className="text-xs text-gray-300 mt-1 truncate max-w-[200px]">
                            {task.description}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge className={priorityInfo.color}>
                            {priorityInfo.label}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <Badge className={severityInfo.color}>
                            {severityInfo.label}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <Badge className={statusInfo.color}>
                            {statusInfo.label}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-center text-white">
                          {task.story_points}
                        </td>
                        <td className="py-4 px-4 text-white">
                          {task.project?.name || "No Project"}
                        </td>
                        <td className="py-4 px-4 text-white">
                          {formatDate(task.deadline)}
                        </td>
                      </tr>
                    );
                  })}

                  {filteredTasks.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        className="py-8 text-center text-gray-300"
                      >
                        No tasks match your current filters
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-gray-300">
              Showing {filteredTasks.length} of {tasks.length} tasks
            </div>
            <Button variant="outline" className="border-gray-600">
              Export Tasks
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
