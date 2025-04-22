import { useState, useEffect, useContext, createContext } from "react";
import { Button } from "../components/components/ui/button";
import { Label } from "../components/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../components/components/ui/card";
import {
  Calendar as CalendarIcon,
  Plus,
  ChevronRight,
  ChevronDown,
  AlertCircle,
  CheckCircle,
  Play,
  ClipboardList,
  Folder,
} from "lucide-react";
import { Calendar } from "../components/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/components/ui/popover";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../components/components/ui/select";
import { format } from "date-fns";
import { Badge } from "../components/components/ui/badge";
import { Progress } from "../components/components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/components/ui/dialog";
import { Alert, AlertDescription } from "../components/components/ui/alert";
import { Separator } from "../components/components/ui/separator";
import { Input } from "../components/components/ui/input";

// Import types and mock data
import { Employee, Task, Sprint, Project, SprintStatus } from "../data/Types";

import {
  mockEmployees,
  mockProjects,
  mockSprints,
  mockTasks,
  findEmployeeById,
  findTaskById,
  findSprintById,
  findProjectById,
  fetchSprintsByProject,
  fetchBacklogTasksByProject,
  fetchEmployeesByProject,
  handleCreateSprint,
  handleAddTaskToSprint,
} from "../data/mockdata";

interface ProjectContextType {
  selectedProject: Project | null;
}

const ProjectContext = createContext<ProjectContextType>({
  selectedProject: null,
});

export const Sprints = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProject = async () => {
      try {
        // Try to get selected project from session storage
        const projectData = sessionStorage.getItem("selectedProject");
        let projectId: string | null = null;

        if (projectData) {
          const parsed = JSON.parse(projectData);
          projectId = parsed.id;
        }

        // If no project was found in session storage, use the first project from mockProjects
        if (!projectId && mockProjects.length > 0) {
          projectId = mockProjects[0].id;
          // Save this project to session storage for future reference
          sessionStorage.setItem(
            "selectedProject",
            JSON.stringify({
              id: mockProjects[0].id,
              name: mockProjects[0].name,
            })
          );
        }

        if (projectId) {
          const project = findProjectById(projectId);
          if (project) {
            setSelectedProject(project);
          }
        }
      } catch (err) {
        setError("Failed to load project data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProject();
  }, []);

  if (isLoading) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} />;
  if (!selectedProject) return <NoProjectScreen />;

  return (
    <ProjectContext.Provider value={{ selectedProject }}>
      <SprintContent />
    </ProjectContext.Provider>
  );
};

const SprintContent = () => {
  const { selectedProject } = useContext(ProjectContext);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [backlogTasks, setBacklogTasks] = useState<Task[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [expandedSprints, setExpandedSprints] = useState<
    Record<string, boolean>
  >({});
  const [activeTab, setActiveTab] = useState("active");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!selectedProject) return;

      try {
        const [sprintData, backlogData, employeeData] = await Promise.all([
          fetchSprintsByProject(selectedProject.id),
          fetchBacklogTasksByProject(selectedProject.id),
          fetchEmployeesByProject(selectedProject.id),
        ]);

        setSprints(sprintData);
        setBacklogTasks(backlogData);
        setEmployees(employeeData);

        setExpandedSprints(
          Object.fromEntries(sprintData.map((s) => [s.id, false]))
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [selectedProject]);

  const handleCreate = async (formData: any) => {
    if (!selectedProject) return;

    const scrumMasterId =
      typeof formData.scrum_master === "string"
        ? formData.scrum_master
        : formData.scrum_master.id;

    const assignedMemberIds = Array.isArray(formData.assigned_members)
      ? formData.assigned_members.map((e: any) =>
          typeof e === "string" ? e : e.id
        )
      : [];

    const newSprint = await handleCreateSprint(selectedProject.id, {
      ...formData,
      project: selectedProject.id,
      scrum_master: scrumMasterId,
      assigned_members: assignedMemberIds,
      tasks: [],
    });

    if (newSprint) {
      setSprints((prev) => [...prev, newSprint]);
    }
  };

  const handleAddTask = async (sprintId: string, taskId: string) => {
    const success = await handleAddTaskToSprint(taskId, sprintId);
    if (!success) return;

    // Refresh the sprint data
    const updatedSprints = await fetchSprintsByProject(selectedProject.id);
    setSprints(updatedSprints);

    // Refresh backlog tasks
    const updatedBacklog = await fetchBacklogTasksByProject(selectedProject.id);
    setBacklogTasks(updatedBacklog);
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="w-full min-h-screen p-8 bg-gray-900 text-white">
      {/* Header and stats */}
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Sprints</h1>
            <p className="text-gray-300">Project: {selectedProject.name}</p>
          </div>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => setCreateDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Sprint
          </Button>
          <CreateSprintDialog
            open={createDialogOpen}
            onOpenChange={setCreateDialogOpen}
            employees={employees}
            onCreate={handleCreate}
          />
        </div>

        {/* Sprint stats cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {Object.values(SprintStatus).map((status) => {
            const count = sprints.filter((s) => s.status === status).length;

            let icon;
            let colors;

            switch (status) {
              case SprintStatus.Active:
                icon = <Play className="h-6 w-6 text-blue-400" />;
                colors = "bg-blue-500/20 text-blue-400";
                break;
              case SprintStatus.Completed:
                icon = <CheckCircle className="h-6 w-6 text-green-400" />;
                colors = "bg-green-500/20 text-green-400";
                break;
              case SprintStatus.Planned:
                icon = <ClipboardList className="h-6 w-6 text-purple-400" />;
                colors = "bg-purple-500/20 text-purple-400";
                break;
              default:
                icon = <Folder className="h-6 w-6 text-gray-400" />;
                colors = "bg-gray-500/20 text-gray-400";
            }

            return (
              <Card key={status} className="bg-gray-800 border-gray-700">
                <CardContent className="p-4 flex flex-col items-center">
                  <div className={`rounded-full p-3 mb-2 ${colors}`}>
                    {icon}
                  </div>
                  <div className="text-2xl font-bold text-white">{count}</div>
                  <p className="text-gray-300 text-sm">{status} Sprints</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Tabs and sprint cards */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-gray-800 grid grid-cols-4 gap-4">
            {["active", "planned", "completed", "all"].map((status) => (
              <TabsTrigger
                key={status}
                value={status}
                className="text-white data-[state=active]:bg-blue-600"
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>

          {["active", "planned", "completed", "all"].map((status) => (
            <TabsContent key={status} value={status} className="space-y-4 mt-4">
              {sprints.length === 0 ? (
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-300">
                      No sprints found for this project
                    </p>
                    <Button
                      className="mt-4 bg-blue-600 hover:bg-blue-700"
                      onClick={() => setCreateDialogOpen(true)}
                    >
                      Create your first sprint
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                sprints
                  .filter(
                    (s) => status === "all" || s.status.toLowerCase() === status
                  )
                  .map((sprint) => (
                    <SprintCard
                      key={sprint.id}
                      sprint={sprint}
                      isExpanded={expandedSprints[sprint.id]}
                      onToggleExpand={() =>
                        setExpandedSprints((prev) => ({
                          ...prev,
                          [sprint.id]: !prev[sprint.id],
                        }))
                      }
                    />
                  ))
              )}

              {sprints.length > 0 &&
                sprints.filter(
                  (s) => status === "all" || s.status.toLowerCase() === status
                ).length === 0 && (
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-6 text-center">
                      <p className="text-gray-300">No {status} sprints found</p>
                    </CardContent>
                  </Card>
                )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Backlog section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Backlog</h2>
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl text-white">
                Project Backlog Tasks ({backlogTasks.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {backlogTasks.length === 0 ? (
                <div className="text-center p-4 text-gray-300">
                  No backlog tasks available
                </div>
              ) : (
                <div className="space-y-2">
                  {backlogTasks.map((task) => (
                    <div key={task.id} className="p-3 bg-gray-700 rounded-md">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium text-white">
                            {task.problem_statement}
                          </h3>
                          <p className="text-sm text-gray-300 mt-1">
                            {task.description.substring(0, 100)}...
                          </p>
                        </div>
                        <div>
                          <Select
                            onValueChange={(value) =>
                              handleAddTask(value, task.id)
                            }
                          >
                            <SelectTrigger className="w-[180px] bg-gray-600 border-gray-500">
                              <SelectValue placeholder="Add to sprint" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-700 text-white border-gray-600">
                              {sprints.map((sprint) => (
                                <SelectItem
                                  key={sprint.id}
                                  value={sprint.id}
                                  className="focus:bg-gray-600"
                                >
                                  {sprint.start_date
                                    ? format(
                                        new Date(sprint.start_date),
                                        "MMM d"
                                      )
                                    : "No date"}{" "}
                                  Sprint
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const SprintCard = ({
  sprint,
  isExpanded,
  onToggleExpand,
}: {
  sprint: Sprint;
  isExpanded: boolean;
  onToggleExpand: () => void;
}) => {
  // Calculate sprint progress
  const progress =
    sprint.total_story_points > 0
      ? Math.round(
          (sprint.completed_story_points / sprint.total_story_points) * 100
        )
      : 0;

  // Format dates
  const startDate = sprint.start_date
    ? format(new Date(sprint.start_date), "MMM d, yyyy")
    : "No start date";
  const endDate = sprint.end_date
    ? format(new Date(sprint.end_date), "MMM d, yyyy")
    : "No end date";

  // Get status badge color
  let statusColor;
  switch (sprint.status) {
    case SprintStatus.Active:
      statusColor = "bg-blue-500/20 text-blue-400 border-blue-500";
      break;
    case SprintStatus.Completed:
      statusColor = "bg-green-500/20 text-green-400 border-green-500";
      break;
    case SprintStatus.Planned:
      statusColor = "bg-purple-500/20 text-purple-400 border-purple-500";
      break;
    default:
      statusColor = "bg-gray-500/20 text-gray-300 border-gray-500";
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl text-white">
              Sprint: {startDate} to {endDate}
            </CardTitle>
            <p className="text-gray-300 text-sm">
              Scrum Master: {sprint.scrum_master.name}
            </p>
          </div>
          <Badge className={statusColor}>{sprint.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="flex justify-between mb-1 text-sm">
              <span className="text-gray-300">Progress</span>
              <span className="text-white">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-gray-700" />
          </div>
          <div>
            <div className="flex justify-between mb-1 text-sm">
              <span className="text-gray-300">Story Points</span>
              <span className="text-white">
                {sprint.completed_story_points} / {sprint.total_story_points}
              </span>
            </div>
            <Progress
              value={
                (sprint.completed_story_points /
                  (sprint.total_story_points || 1)) *
                100
              }
              className="h-2 bg-gray-700"
            />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap mb-4">
          <p className="text-sm text-gray-300 mr-1">Team:</p>
          {sprint.assigned_members.map((member) => (
            <Badge
              key={member.id}
              variant="outline"
              className="bg-gray-700 text-white"
            >
              {member.name}
            </Badge>
          ))}
        </div>

        {isExpanded && sprint.tasks.length > 0 && (
          <div className="mt-4 space-y-2">
            <Separator className="bg-gray-700 my-4" />
            <h3 className="font-medium text-white mb-2">
              Tasks ({sprint.tasks.length})
            </h3>
            {sprint.tasks.map((task) => (
              <div key={task.id} className="p-3 bg-gray-700 rounded-md">
                <div className="font-medium text-white">
                  {task.problem_statement}
                </div>
                <div className="text-xs text-gray-300 mt-1">
                  {task.description.substring(0, 100)}...
                </div>
                <div className="flex gap-2 mt-2">
                  <Badge className="bg-blue-500/20 text-blue-400">
                    {task.story_points} pts
                  </Badge>
                  <Badge className="bg-gray-500/20 text-gray-300">
                    {task.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          variant="ghost"
          className="w-full text-gray-300 hover:text-white hover:bg-gray-700"
          onClick={onToggleExpand}
        >
          {isExpanded ? (
            <>
              <ChevronDown className="h-4 w-4 mr-2" />
              Hide Tasks
            </>
          ) : (
            <>
              <ChevronRight className="h-4 w-4 mr-2" />
              Show Tasks ({sprint.tasks.length})
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

const CreateSprintDialog = ({
  open,
  onOpenChange,
  employees,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employees: Employee[];
  onCreate: (data: any) => void;
}) => {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [scrumMaster, setScrumMaster] = useState<string>("");
  const [team, setTeam] = useState<string[]>([]);

  // Simplified date input handlers - no calendar popover
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setStartDate(new Date(e.target.value));
    } else {
      setStartDate(undefined);
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setEndDate(new Date(e.target.value));
    } else {
      setEndDate(undefined);
    }
  };

  const handleSubmit = () => {
    if (!startDate || !endDate || !scrumMaster) return;

    onCreate({
      start_date: startDate,
      end_date: endDate,
      scrum_master: scrumMaster,
      assigned_members: team,
      status: SprintStatus.Planned,
      total_story_points: 0,
      completed_story_points: 0,
    });

    // Reset form
    setStartDate(undefined);
    setEndDate(undefined);
    setScrumMaster("");
    setTeam([]);

    // Close dialog
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">
            Create New Sprint
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Plan your next sprint by setting dates and assigning team members.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date" className="text-white">
                Start Date
              </Label>
              <Input
                id="start-date"
                type="date"
                className="bg-gray-700 border-gray-600 text-white"
                value={startDate ? startDate.toISOString().split("T")[0] : ""}
                onChange={handleStartDateChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-date" className="text-white">
                End Date
              </Label>
              <Input
                id="end-date"
                type="date"
                className="bg-gray-700 border-gray-600 text-white"
                value={endDate ? endDate.toISOString().split("T")[0] : ""}
                onChange={handleEndDateChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="scrum-master" className="text-white">
              Scrum Master
            </Label>
            <Select value={scrumMaster} onValueChange={setScrumMaster}>
              <SelectTrigger
                id="scrum-master"
                className="bg-gray-700 border-gray-600 text-white"
              >
                <SelectValue placeholder="Select scrum master" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600 text-white">
                {employees.map((emp) => (
                  <SelectItem
                    key={emp.id}
                    value={emp.id}
                    className="focus:bg-gray-600"
                  >
                    {emp.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="team" className="text-white">
              Team Members
            </Label>
            <Select>
              <SelectTrigger
                id="team"
                className="bg-gray-700 border-gray-600 text-white"
              >
                <SelectValue placeholder="Select team members" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600 text-white">
                {employees.map((emp) => (
                  <SelectItem
                    key={emp.id}
                    value={emp.id}
                    className="focus:bg-gray-600"
                  >
                    {emp.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2 flex-wrap mt-2">
              {team.map((memberId) => {
                const member = employees.find((e) => e.id === memberId);
                return member ? (
                  <Badge
                    key={memberId}
                    variant="outline"
                    className="bg-gray-700 text-white"
                  >
                    {member.name}
                  </Badge>
                ) : null;
              })}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleSubmit}
          >
            Create Sprint
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const LoadingScreen = () => (
  <div className="w-full h-screen flex items-center justify-center bg-gray-900 text-white">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p>Loading sprints...</p>
    </div>
  </div>
);

const ErrorScreen = ({ error }: { error: string }) => (
  <div className="w-full h-screen p-8 bg-gray-900 text-white">
    <Alert variant="destructive" className="bg-red-900 border-red-800">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  </div>
);

const NoProjectScreen = () => (
  <div className="w-full h-screen p-8 bg-gray-900 text-white">
    <div className="max-w-[600px] mx-auto mt-16 text-center">
      <h1 className="text-3xl font-bold mb-4">No Project Selected</h1>
      <p className="text-gray-300 mb-8">
        Please select a project from the dropdown in the navigation menu.
      </p>
      <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
        <a href="/projects">Browse Projects</a>
      </Button>
    </div>
  </div>
);

export default Sprints;
