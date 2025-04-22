import { useState, useEffect, useContext, createContext } from "react";
import { Button } from "@components/components/ui/button";
import { Label } from "@components/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@components/components/ui/card";
import { Calendar as CalendarIcon, Plus, ChevronRight, ChevronDown, AlertCircle } from "lucide-react";
import { Calendar } from "@components/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@components/components/ui/popover";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@components/components/ui/select";
import { format } from "date-fns";
import { Badge } from "@components/components/ui/badge";
import { Progress } from "@components/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@components/components/ui/dialog";
import { Alert, AlertDescription } from "@components/components/ui/alert";

// Import types and mock data
import {
  Employee,
  Task,
  Sprint,
  Project,
} from '@data/Types';

import {
  mockEmployees,
  mockProjects,
  mockSprints,
  mockTasks,
  fetchSprintsByProject,
  fetchBacklogTasksByProject,
  fetchProjectById,
  fetchEmployeesByProject,
  handleCreateSprint,
  handleAddTaskToSprint
} from '@data/mockdata';

interface ProjectContextType {
  selectedProject: Project | null;
}

const ProjectContext = createContext<ProjectContextType>({
  selectedProject: null
});

// Resolver functions
const resolve = {
  employee: (id: string) => mockEmployees.find(e => e.id === id) || null,
  task: (id: string) => mockTasks.find(t => t.id === id) || null,
  sprint: (id: string) => mockSprints.find(s => s.id === id) || null,
  project: (id: string) => mockProjects.find(p => p.id === id) || null,
};

export const Sprints = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const projectData = sessionStorage.getItem("selectedProject");
        if (!projectData) return;
        
        const { id } = JSON.parse(projectData);
        if (!id) return;

        const project = await fetchProjectById(id);
        if (project) {
          setSelectedProject({
            ...project,
            employees: project.employees.map(id => resolve.employee(id)!),
            tasks: project.tasks.map(id => resolve.task(id)!),
            sprints: project.sprints.map(id => resolve.sprint(id)!)
          });
        }
      } catch (err) {
        setError("Failed to load project data");
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
  const [expandedSprints, setExpandedSprints] = useState<Record<string, boolean>>({});
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
          fetchEmployeesByProject(selectedProject.id)
        ]);

        setSprints(sprintData.map(s => ({
          ...s,
          project: resolve.project(s.project)!,
          scrum_master: resolve.employee(s.scrum_master)!,
          tasks: s.tasks.map(tId => resolve.task(tId)!),
          assigned_members: s.assigned_members.map(eId => resolve.employee(eId)!)
        })));

        setBacklogTasks(backlogData.map(t => ({
          ...t,
          project: resolve.project(t.project)!,
          parent_sprint: t.parent_sprint ? resolve.sprint(t.parent_sprint) : undefined,
          assignee: t.assignee ? resolve.employee(t.assignee) : undefined
        })));

        setEmployees(employeeData.map(eId => resolve.employee(eId)!));
        
        setExpandedSprints(Object.fromEntries(
          sprintData.map(s => [s.id, false])
        ));
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [selectedProject]);

  const handleCreate = async (formData: Omit<Sprint, "id">) => {
    if (!selectedProject) return;
    
    const newSprint = await handleCreateSprint(selectedProject.id, {
      ...formData,
      project: selectedProject.id,
      scrum_master: formData.scrum_master.id,
      assigned_members: formData.assigned_members.map(e => e.id),
      tasks: []
    });

    setSprints(prev => [...prev, {
      ...newSprint,
      project: selectedProject,
      scrum_master: formData.scrum_master,
      tasks: [],
      assigned_members: formData.assigned_members
    }]);
  };

  const handleAddTask = async (sprintId: string, taskId: string) => {
    const updatedSprint = await handleAddTaskToSprint(sprintId, taskId);
    if (!updatedSprint) return;

    setSprints(prev => prev.map(s => s.id === sprintId ? {
      ...s,
      tasks: [...s.tasks, resolve.task(taskId)!],
      total_story_points: s.total_story_points + (resolve.task(taskId)?.story_points || 0)
    } : s));
    
    setBacklogTasks(prev => prev.filter(t => t.id !== taskId));
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="w-full min-h-screen p-8 bg-gray-900 text-white">
      {/* Header and stats */}
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Sprints</h1>
            <p className="text-gray-400">Project: {selectedProject.name}</p>
          </div>
          <CreateSprintDialog 
            open={createDialogOpen}
            onOpenChange={setCreateDialogOpen}
            employees={employees}
            onCreate={handleCreate}
          />
        </div>

        {/* Tabs and sprint cards */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-gray-800 grid grid-cols-4 gap-4">
            {["active", "planned", "completed", "all"].map(status => (
              <TabsTrigger key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>

          {["active", "planned", "completed", "all"].map(status => (
            <TabsContent key={status} value={status} className="space-y-4">
              {sprints
                .filter(s => status === "all" || s.status === status)
                .map(sprint => (
                  <SprintCard
                    key={sprint.id}
                    sprint={sprint}
                    isExpanded={expandedSprints[sprint.id]}
                    onToggleExpand={() => setExpandedSprints(prev => ({
                      ...prev,
                      [sprint.id]: !prev[sprint.id]
                    }))}
                    onUpdate={updated => setSprints(prev => 
                      prev.map(s => s.id === sprint.id ? updated : s)
                    )}
                  />
                ))}
            </TabsContent>
          ))}
        </Tabs>

        {/* Backlog section */}
        <BacklogSection 
          tasks={backlogTasks}
          sprints={sprints}
          onAddToSprint={handleAddTask}
        />
      </div>
    </div>
  );
};

const SprintCard = ({
  sprint,
  isExpanded,
  onToggleExpand,
  onUpdate
}: {
  sprint: Sprint;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onUpdate: (updated: Sprint) => void;
}) => {
  const [localSprint, setLocalSprint] = useState(sprint);

  const handleUpdate = () => {
    onUpdate(localSprint);
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="cursor-pointer" onClick={onToggleExpand}>
        {/* Header content */}
      </CardHeader>
      {isExpanded && (
        <CardContent>
          {/* Editable sprint details */}
        </CardContent>
      )}
    </Card>
  );
};

const CreateSprintDialog = ({
  open,
  onOpenChange,
  employees,
  onCreate
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employees: Employee[];
  onCreate: (data: Omit<Sprint, "id">) => void;
}) => {
  const [formData, setFormData] = useState<Omit<Sprint, "id">>({
    start_date: new Date(),
    end_date: new Date(),
    status: "planned",
    scrum_master: employees[0],
    assigned_members: [],
    project: {} as Project,
    // Other required fields
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Dialog content */}
    </Dialog>
  );
};

const BacklogSection = ({ tasks, sprints, onAddToSprint }: {
  tasks: Task[];
  sprints: Sprint[];
  onAddToSprint: (sprintId: string, taskId: string) => void;
}) => (
  <Card className="bg-gray-800 border-gray-700 mt-6">
    <CardHeader>
      <CardTitle>Backlog</CardTitle>
    </CardHeader>
    <CardContent>
      {tasks.map(task => (
        <div key={task.id} className="flex justify-between items-center p-2">
          <div>{task.problem_statement}</div>
          <Select onValueChange={sprintId => onAddToSprint(sprintId, task.id)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Add to Sprint" />
            </SelectTrigger>
            <SelectContent>
              {sprints.map(sprint => (
                <SelectItem key={sprint.id} value={sprint.id}>
                  {sprint.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
    </CardContent>
  </Card>
);

// Helper components
const LoadingScreen = () => (
  <div className="w-full h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
  </div>
);

const ErrorScreen = ({ error }: { error: string }) => (
  <div className="w-full h-screen p-8">
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  </div>
);

const NoProjectScreen = () => (
  <div className="w-full h-screen p-8">
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>No Project Selected</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Please select a project from the navigation menu</p>
      </CardContent>
    </Card>
  </div>
);

export default Sprints;