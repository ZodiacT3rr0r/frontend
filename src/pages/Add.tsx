import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@components/components/ui/input";
import { Button } from "@components/components/ui/button";
import { Label } from "@components/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@components/components/ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@components/components/ui/select";
import { Textarea } from "@components/components/ui/textarea";
import { Calendar } from "@components/components/ui/calendar"; // Date picker component
import { format } from "date-fns";
import React, { useState, useEffect } from "react"

import {
  IssueType,
  IssuePriority,
  IssueTypeCopy,
  IssuePriorityCopy,
} from "../data/Issue";

const formSchema = z.object({
  issueType: z.nativeEnum(IssueType, { errorMap: () => ({ message: "Please select an issue type" }) }),
  priority: z.nativeEnum(IssuePriority, { errorMap: () => ({ message: "Please select a priority" }) }),
  deadline: z.date().refine(date => date > new Date(), { message: "Deadline must be in the future" }),
  description: z.string().min(10, "Description must be at least 10 characters"),
  projectId: z.string().min(1, "Project is required"),
  assigneeId: z.string().min(1, "Assignee is required"),
});

type FormValues = z.infer<typeof formSchema>;

const fetchProjects = async () => {
  const response = await fetch("https://dummyjson.com/projects"); // Dummy API
  const data = await response.json();
  return data.projects;
};

const fetchEmployees = async () => {
  const response = await fetch("https://dummyjson.com/employees"); // Dummy API
  const data = await response.json();
  return data.employees;
};

export const Add = () => {
  return (
    <div className="w-full h-screen p-16">
      <AddTaskForm />
    </div>
  );
};

const AddTaskForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form Data:", data);
  };

  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [date, setDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    fetchProjects().then(setProjects);
    fetchEmployees().then(setEmployees);
  }, []);

  return (
    <Card className="bg-black text-white max-w-[600px] mx-auto p-4">
      <CardHeader>
        <CardTitle className="text-2xl">Create Task</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <div className="flex justify-between">
            <div className="flex flex-wrap gap-4">
              {/* Issue Type */}
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
                {errors.issueType && <p className="text-red-500 text-sm">{errors.issueType.message}</p>}
              </div>

              {/* Priority */}
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
                {errors.priority && <p className="text-red-500 text-sm">{errors.priority.message}</p>}
              </div>

              {/* Link to Project */}
              <div>
                <Label className="mb-2">Project</Label>
                <Select onValueChange={(value) => setValue("projectId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map(project => (
                      <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.projectId && <p className="text-red-500 text-sm">{errors.projectId.message}</p>}
              </div>

              {/* Assign to Employee */}
              <div>
                <Label className="mb-2">Assign to Employee</Label>
                <Select onValueChange={(value) => setValue("assigneeId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map(employee => (
                      <SelectItem key={employee.id} value={employee.id}>{employee.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Deadline */}
            <div>
              <Label className="mb-2">Deadline</Label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={(selectedDate) => {
                  if (selectedDate) {
                    setDate(selectedDate); // Update state
                    setValue("deadline", selectedDate, { shouldValidate: true }); // Update form and trigger validation
                  }
                }}
                className="rounded-md border w-fit"
              />
              {errors.deadline && <p className="text-red-500 text-sm">{errors.deadline.message}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <Label className="mb-2">Description</Label>
            <Textarea {...register("description")} placeholder="Enter description" />
            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
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
