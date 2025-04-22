import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@components/components/ui/button";
import { Label } from "@components/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@components/components/ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@components/components/ui/select";
import { Textarea } from "@components/components/ui/textarea";
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@components/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@components/components/ui/popover";
import { format } from "date-fns"
import { useState, useEffect } from "react"
import MarkdownEditor from "../components/Input/MarkdownEditor";

import {
  IssueType,
  IssuePriority,
  IssueTypeCopy,
  IssuePriorityCopy,
  TaskStatus,
} from "../data/Issue";

const formSchema = z.object({
  projectId: z.string().min(1, "Project is required"),
  assigneeId: z.string().min(1, "Assignee is required"),
  issueType: z.nativeEnum(IssueType, { errorMap: () => ({ message: "Please select an issue type" }) }),
  priority: z.nativeEnum(IssuePriority, { errorMap: () => ({ message: "Please select a priority" }) }),
  deadline: z.date().refine(date => date > new Date(), { message: "Deadline must be in the future" }),
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

const fetchProjects = async () => {
  const response = await fetch("https://dummyjson.com/projects");
  const data = await response.json();
  return data.projects;
};

const fetchEmployees = async () => {
  const response = await fetch("https://dummyjson.com/employees");
  const data = await response.json();
  return data.employees;
};

export const Add = () => {  
  return (
    <div className="w-full h-screen p-16 overflow-auto">
      <AddTaskForm />
    </div>
  );
};

const AddTaskForm = () => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const formData = new FormData();
      
      formData.append("projectId", data.projectId);
      formData.append("assigneeId", data.assigneeId);
      formData.append("issueType", data.issueType);
      formData.append("priority", data.priority);
      formData.append("deadline", format(data.deadline, "yyyy-MM-dd'T'HH:mm:ss"));
      formData.append("description", data.description);
      formData.append("storyPoints", String(data.storyPoints));
      formData.append("estimatedHours", String(data.estimatedHours));
      formData.append("status", data.status);
      formData.append("blocked", String(data.blocked));
  
      if (data.blocked && data.blockedReason) {
        formData.append("blockedReason", data.blockedReason);
      }
  
      if (files.length > 0) {
        files.forEach(file => formData.append("attachedFiles", file));
      }
  
      // If there are pre-requisite or dependent tasks, append them as well
      if (data.preRequisiteTasks) {
        data.preRequisiteTasks.forEach(taskId => formData.append("preRequisiteTasks", taskId));
      }
      if (data.dependentTasks) {
        data.dependentTasks.forEach(taskId => formData.append("dependentTasks", taskId));
      }
  
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error("Task creation failed");
      }
  
      const responseData = await response.json();
      console.log("Task Created Successfully:", responseData);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };
  

  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    fetchProjects().then(setProjects);
    fetchEmployees().then(setEmployees);
  }, []);

  return (
    <Card className="bg-black text-white max-w-[1200px] min-w-[700px] mx-auto p-4 ">
      <CardHeader>
        <CardTitle className="text-2xl">Create Task</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex gap-4">
            {/* Project Selection */}
            <div>
              <Label className="mb-2">Project</Label>
              <Select onValueChange={(value) => setValue("projectId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map(proj => (
                    <SelectItem key={proj.id} value={proj.id}>{proj.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.projectId && <p className="text-red-500 text-sm">{errors.projectId.message}</p>}
            </div>

            {/* Assignee Selection */}
            <div>
              <Label className="mb-2">Assignee</Label>
              <Select onValueChange={(value) => setValue("assigneeId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Assignee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map(emp => (
                    <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.assigneeId && <p className="text-red-500 text-sm">{errors.assigneeId.message}</p>}
            </div>
          </div>

          {/* Issue Type & Priority */}
          <div className="flex gap-4">
            <div>
              <Label className="mb-2">Issue Type</Label>
              <Select onValueChange={(value) => setValue("issueType", value as IssueType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Issue Type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(IssueType).map(type => (
                    <SelectItem key={type} value={type}>{IssueTypeCopy[type]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-2">Priority</Label>
              <Select onValueChange={(value) => setValue("priority", value as IssuePriority)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Priority" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(IssuePriority).map(priority => (
                    <SelectItem key={priority} value={priority}>{IssuePriorityCopy[priority]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Deadline */}
            <div>
              <Label className="mb-2">Deadline</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full flex justify-between items-center bg-black hover:bg-black hover:text-white">
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                    <CalendarIcon className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-black text-white" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(selectedDate) => {
                      if (selectedDate) {
                        setDate(selectedDate);
                        setValue("deadline", selectedDate, { shouldValidate: true });
                      }
                    }}
                    disabled={(d) => d <= new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.deadline && <p className="text-red-500 text-sm">{errors.deadline.message}</p>}
            </div>
            {/* Status */}
            <div>
              <Label className="mb-2">Status</Label>
              <Select onValueChange={(value) => setValue("status", value as TaskStatus)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(TaskStatus).map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
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
              onChange={(content) => setValue("description", content, { shouldValidate: true })}
              placeholder="Enter task description..."
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
          </div>

          {/* Blocked Checkbox */}
          <div className="flex">
            <input type="checkbox" {...register("blocked")} id="blocked" />
            <Label htmlFor="blocked" className="ml-2">Blocked</Label>
          </div>

          {/* Blocked Reason */}
          {watch("blocked") && (
            <div>
              <Label className="mb-2">Blocked Reason</Label>
              <Textarea {...register("blockedReason")} className="w-full" placeholder="Enter reason..." />
            </div>
          )}

          {/* Comments */}
          <div>
            <Label className="mb-2">Comments</Label>
            <Textarea {...register("comments")} className="w-full" placeholder="Additional comments..." />
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
