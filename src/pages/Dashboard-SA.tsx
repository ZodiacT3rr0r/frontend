import { useState, useEffect } from "react";
import { Button } from "../components/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../components/components/ui/card";
import { Alert, AlertDescription } from "../components/components/ui/alert";
import { Badge } from "../components/components/ui/badge";
import { Progress } from "../components/components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/components/ui/tabs";
import { Separator } from "../components/components/ui/separator";
import {
  CircleUser,
  Users,
  Briefcase,
  Server,
  AlertCircle,
  Activity,
  Settings,
  ChevronRight,
  BarChart3,
  Clock,
  CheckCircle,
  Plus,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Types for mock data
interface SystemStats {
  total_users: number;
  total_orgs: number;
  active_projects: number;
  server_uptime: string;
  server_load: number;
  storage_usage: number;
  total_storage: number;
  recent_logins: number;
  support_tickets: {
    open: number;
    closed: number;
    critical: number;
  };
  system_alerts: {
    critical: number;
    warning: number;
    info: number;
  };
}

interface OrgStats {
  total_projects: number;
  active_projects: number;
  total_users: number;
  active_users: number;
  completed_sprints: number;
  overdue_tasks: number;
  storage_usage: number;
  total_storage: number;
  task_completion_rate: number;
  recent_activity: {
    tasks_created: number;
    tasks_completed: number;
    comments_added: number;
  };
}

interface RecentActivity {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  entity: string;
  entity_type: string;
}

interface SystemAlert {
  id: string;
  level: "critical" | "warning" | "info";
  message: string;
  timestamp: string;
  is_resolved: boolean;
}

interface Organization {
  id: string;
  name: string;
  active_users: number;
  total_users: number;
  projects: number;
  storage_usage: number;
  status: "active" | "inactive" | "suspended";
}

interface Project {
  id: string;
  name: string;
  active_tasks: number;
  total_tasks: number;
  active_users: number;
  last_activity: string;
  progress: number;
  status: "active" | "completed" | "on_hold";
}

// Mock data fetching functions
const fetchSystemStats = async (): Promise<SystemStats> => {
  // Simulating API request
  return {
    total_users: 3784,
    total_orgs: 156,
    active_projects: 493,
    server_uptime: "27 days, 13 hours",
    server_load: 32,
    storage_usage: 4.7,
    total_storage: 10,
    recent_logins: 382,
    support_tickets: {
      open: 17,
      closed: 243,
      critical: 3,
    },
    system_alerts: {
      critical: 2,
      warning: 5,
      info: 8,
    },
  };
};

const fetchOrgStats = async (): Promise<OrgStats> => {
  // Simulating API request
  return {
    total_projects: 23,
    active_projects: 15,
    total_users: 142,
    active_users: 98,
    completed_sprints: 37,
    overdue_tasks: 12,
    storage_usage: 1.8,
    total_storage: 5,
    task_completion_rate: 78,
    recent_activity: {
      tasks_created: 45,
      tasks_completed: 32,
      comments_added: 128,
    },
  };
};

const fetchRecentSystemActivity = async (): Promise<RecentActivity[]> => {
  // Simulating API request
  return [
    {
      id: "act-123",
      user: "admin@example.com",
      action: "User created",
      timestamp: "2025-04-22T09:45:00Z",
      entity: "john.doe@company.com",
      entity_type: "user",
    },
    {
      id: "act-124",
      user: "system",
      action: "Organization upgraded",
      timestamp: "2025-04-22T08:30:00Z",
      entity: "Acme Corp",
      entity_type: "organization",
    },
    {
      id: "act-125",
      user: "support@taskpilot.com",
      action: "Support ticket resolved",
      timestamp: "2025-04-22T07:15:00Z",
      entity: "Ticket #4532",
      entity_type: "support_ticket",
    },
    {
      id: "act-126",
      user: "system",
      action: "Server maintenance completed",
      timestamp: "2025-04-21T23:30:00Z",
      entity: "East Region Server",
      entity_type: "server",
    },
    {
      id: "act-127",
      user: "admin@example.com",
      action: "API key generated",
      timestamp: "2025-04-21T16:20:00Z",
      entity: "TechCorp API",
      entity_type: "api_key",
    },
  ];
};

const fetchRecentOrgActivity = async (): Promise<RecentActivity[]> => {
  // Simulating API request
  return [
    {
      id: "act-223",
      user: "sarah.smith@company.com",
      action: "Sprint created",
      timestamp: "2025-04-22T10:15:00Z",
      entity: "Sprint 24",
      entity_type: "sprint",
    },
    {
      id: "act-224",
      user: "mike.jones@company.com",
      action: "Task completed",
      timestamp: "2025-04-22T09:45:00Z",
      entity: "Implement login form",
      entity_type: "task",
    },
    {
      id: "act-225",
      user: "emma.wilson@company.com",
      action: "Comment added",
      timestamp: "2025-04-22T09:30:00Z",
      entity: "Database migration task",
      entity_type: "comment",
    },
    {
      id: "act-226",
      user: "robert.brown@company.com",
      action: "Project created",
      timestamp: "2025-04-21T16:45:00Z",
      entity: "Mobile App Redesign",
      entity_type: "project",
    },
    {
      id: "act-227",
      user: "jennifer.davis@company.com",
      action: "User added to project",
      timestamp: "2025-04-21T14:20:00Z",
      entity: "Frontend Dashboard",
      entity_type: "project_user",
    },
  ];
};

const fetchSystemAlerts = async (): Promise<SystemAlert[]> => {
  // Simulating API request
  return [
    {
      id: "alert-001",
      level: "critical",
      message: "Database connection pool nearing limit",
      timestamp: "2025-04-22T08:15:00Z",
      is_resolved: false,
    },
    {
      id: "alert-002",
      level: "warning",
      message: "East region server at 85% CPU usage",
      timestamp: "2025-04-22T07:30:00Z",
      is_resolved: false,
    },
    {
      id: "alert-003",
      level: "info",
      message: "System update scheduled for 2025-04-25",
      timestamp: "2025-04-22T06:45:00Z",
      is_resolved: false,
    },
    {
      id: "alert-004",
      level: "warning",
      message: "Authentication service experiencing high latency",
      timestamp: "2025-04-21T22:10:00Z",
      is_resolved: true,
    },
    {
      id: "alert-005",
      level: "critical",
      message: "Storage server running low on space",
      timestamp: "2025-04-21T18:30:00Z",
      is_resolved: false,
    },
  ];
};

const fetchOrganizations = async (): Promise<Organization[]> => {
  // Simulating API request
  return [
    {
      id: "org-001",
      name: "Acme Corporation",
      active_users: 87,
      total_users: 120,
      projects: 15,
      storage_usage: 3.2,
      status: "active",
    },
    {
      id: "org-002",
      name: "TechStart Inc.",
      active_users: 45,
      total_users: 65,
      projects: 8,
      storage_usage: 1.8,
      status: "active",
    },
    {
      id: "org-003",
      name: "Global Systems",
      active_users: 128,
      total_users: 150,
      projects: 23,
      storage_usage: 4.5,
      status: "active",
    },
    {
      id: "org-004",
      name: "Innovate Solutions",
      active_users: 0,
      total_users: 35,
      projects: 5,
      storage_usage: 0.7,
      status: "suspended",
    },
    {
      id: "org-005",
      name: "Frontier Tech",
      active_users: 52,
      total_users: 80,
      projects: 11,
      storage_usage: 2.3,
      status: "active",
    },
  ];
};

const fetchProjects = async (): Promise<Project[]> => {
  // Simulating API request
  return [
    {
      id: "proj-001",
      name: "Website Redesign",
      active_tasks: 28,
      total_tasks: 45,
      active_users: 8,
      last_activity: "2025-04-22T10:15:00Z",
      progress: 62,
      status: "active",
    },
    {
      id: "proj-002",
      name: "Mobile App Development",
      active_tasks: 34,
      total_tasks: 78,
      active_users: 12,
      last_activity: "2025-04-22T09:30:00Z",
      progress: 43,
      status: "active",
    },
    {
      id: "proj-003",
      name: "Database Migration",
      active_tasks: 5,
      total_tasks: 32,
      active_users: 4,
      last_activity: "2025-04-21T16:45:00Z",
      progress: 84,
      status: "active",
    },
    {
      id: "proj-004",
      name: "API Integration",
      active_tasks: 0,
      total_tasks: 24,
      active_users: 0,
      last_activity: "2025-04-20T14:20:00Z",
      progress: 100,
      status: "completed",
    },
    {
      id: "proj-005",
      name: "Security Audit",
      active_tasks: 0,
      total_tasks: 18,
      active_users: 0,
      last_activity: "2025-04-19T11:30:00Z",
      progress: 65,
      status: "on_hold",
    },
  ];
};

// Chart data
const systemUsageData = [
  { name: "Jan", users: 2100, orgs: 120 },
  { name: "Feb", users: 2400, orgs: 132 },
  { name: "Mar", users: 2800, orgs: 141 },
  { name: "Apr", users: 3200, orgs: 148 },
  { name: "May", users: 3784, orgs: 156 },
];

const orgTaskData = [
  { name: "Week 1", completed: 45, created: 52 },
  { name: "Week 2", completed: 38, created: 41 },
  { name: "Week 3", completed: 52, created: 48 },
  { name: "Week 4", completed: 35, created: 39 },
];

// Format date helper
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(date);
};

// SystemAdmin Dashboard Component
export const SystemAdminDashboard = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeTab, setActiveTab] = useState<string>("overview");

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [statsData, activityData, alertsData, orgsData, projectsData] =
          await Promise.all([
            fetchSystemStats(),
            fetchRecentSystemActivity(),
            fetchSystemAlerts(),
            fetchOrganizations(),
            fetchProjects(),
          ]);

        setStats(statsData);
        setRecentActivity(activityData);
        setSystemAlerts(alertsData);
        setOrganizations(orgsData);
        setProjects(projectsData);
      } catch (err) {
        setError("Failed to load dashboard data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen p-8 bg-gray-900 text-white">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen p-8 bg-gray-900 text-white">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">
              System Administrator Dashboard
            </h1>
            <p className="text-gray-300">Manage your TaskPilot instance</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Settings className="h-4 w-4 mr-2" />
            System Settings
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4 flex flex-col items-center">
              <div className="rounded-full bg-blue-500/20 p-3 mb-2">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white">
                {stats?.total_users.toLocaleString()}
              </div>
              <p className="text-gray-300 text-sm">Total Users</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4 flex flex-col items-center">
              <div className="rounded-full bg-emerald-500/20 p-3 mb-2">
                <Briefcase className="h-6 w-6 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-white">
                {stats?.total_orgs.toLocaleString()}
              </div>
              <p className="text-gray-300 text-sm">Organizations</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4 flex flex-col items-center">
              <div className="rounded-full bg-purple-500/20 p-3 mb-2">
                <Activity className="h-6 w-6 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white">
                {stats?.active_projects.toLocaleString()}
              </div>
              <p className="text-gray-300 text-sm">Active Projects</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4 flex flex-col items-center">
              <div className="rounded-full bg-amber-500/20 p-3 mb-2">
                <Server className="h-6 w-6 text-amber-400" />
              </div>
              <div className="text-2xl font-bold text-white">
                {stats?.server_uptime}
              </div>
              <p className="text-gray-300 text-sm">Server Uptime</p>
            </CardContent>
          </Card>
        </div>

        <Tabs
          defaultValue="overview"
          className="mb-6"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid grid-cols-4 gap-4 bg-gray-800">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-blue-600 text-white"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="organizations"
              className="data-[state=active]:bg-blue-600 text-white"
            >
              Organizations
            </TabsTrigger>
            <TabsTrigger
              value="alerts"
              className="data-[state=active]:bg-blue-600 text-white"
            >
              System Alerts
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="data-[state=active]:bg-blue-600 text-white"
            >
              Activity Log
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <div className="grid grid-cols-3 gap-6">
              <Card className="bg-gray-800 border-gray-700 col-span-2">
                <CardHeader>
                  <CardTitle className="text-xl text-white">
                    System Usage Trends
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={systemUsageData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis dataKey="name" stroke="#e0e0e0" />
                        <YAxis stroke="#e0e0e0" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#222",
                            borderColor: "#444",
                            color: "#fff",
                          }}
                          itemStyle={{ color: "#fff" }}
                          labelStyle={{ color: "#e0e0e0" }}
                        />
                        <Bar dataKey="users" fill="#3b82f6" name="Users" />
                        <Bar
                          dataKey="orgs"
                          fill="#10b981"
                          name="Organizations"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-xl text-white">
                    Support Tickets
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1 text-sm text-white">
                        <span>Open Tickets</span>
                        <span className="font-medium">
                          {stats?.support_tickets.open}
                        </span>
                      </div>
                      <Progress
                        value={
                          ((stats?.support_tickets.open || 0) /
                            ((stats?.support_tickets.open || 0) +
                              (stats?.support_tickets.closed || 0))) *
                          100
                        }
                        className="h-2 bg-gray-700"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1 text-sm text-white">
                        <span>Critical Issues</span>
                        <span className="font-medium">
                          {stats?.support_tickets.critical}
                        </span>
                      </div>
                      <Progress
                        value={
                          ((stats?.support_tickets.critical || 0) /
                            (stats?.support_tickets.open || 1)) *
                          100
                        }
                        className="h-2 bg-gray-700"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1 text-sm text-white">
                        <span>Recently Resolved</span>
                        <span className="font-medium">
                          {stats?.support_tickets.closed}
                        </span>
                      </div>
                      <Progress value={100} className="h-2 bg-gray-700" />
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-base font-medium mb-2 text-white">
                      System Resources
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1 text-sm text-white">
                          <span>Server Load</span>
                          <span className="font-medium">
                            {stats?.server_load}%
                          </span>
                        </div>
                        <Progress
                          value={stats?.server_load || 0}
                          className="h-2 bg-gray-700"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1 text-sm text-white">
                          <span>Storage Usage</span>
                          <span className="font-medium">
                            {stats?.storage_usage} / {stats?.total_storage} TB
                          </span>
                        </div>
                        <Progress
                          value={
                            ((stats?.storage_usage || 0) /
                              (stats?.total_storage || 1)) *
                            100
                          }
                          className="h-2 bg-gray-700"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button
                    variant="outline"
                    className="w-full text-white border-gray-600 hover:bg-gray-700"
                  >
                    View Support Dashboard
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-6 mt-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-xl text-white">
                    System Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {systemAlerts.filter((alert) => !alert.is_resolved).length >
                  0 ? (
                    <div className="space-y-3">
                      {systemAlerts
                        .filter((alert) => !alert.is_resolved)
                        .slice(0, 3)
                        .map((alert) => (
                          <div
                            key={alert.id}
                            className="flex items-start gap-3 p-3 rounded bg-gray-700"
                          >
                            <div
                              className={`flex-shrink-0 rounded-full p-1 ${
                                alert.level === "critical"
                                  ? "bg-red-500/20 text-red-400"
                                  : alert.level === "warning"
                                  ? "bg-amber-500/20 text-amber-400"
                                  : "bg-blue-500/20 text-blue-400"
                              }`}
                            >
                              <AlertCircle className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <Badge
                                  className={
                                    alert.level === "critical"
                                      ? "bg-red-500/20 text-red-400 border-red-500"
                                      : alert.level === "warning"
                                      ? "bg-amber-500/20 text-amber-400 border-amber-500"
                                      : "bg-blue-500/20 text-blue-400 border-blue-500"
                                  }
                                >
                                  {alert.level.toUpperCase()}
                                </Badge>
                                <span className="text-xs text-gray-300">
                                  {formatDate(alert.timestamp)}
                                </span>
                              </div>
                              <p className="text-sm text-white">
                                {alert.message}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 rounded-full text-white hover:bg-gray-600"
                            >
                              <ChevronRight className="h-4 w-4" />
                              <span className="sr-only">View alert</span>
                            </Button>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center p-4 text-gray-300">
                      <CheckCircle className="h-6 w-6 mx-auto mb-2" />
                      <p>No active system alerts</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full border-gray-600"
                    onClick={() => setActiveTab("alerts")}
                  >
                    View All Alerts
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="organizations" className="mt-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl text-white">
                  Organizations
                </CardTitle>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Organization
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {organizations.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-gray-700">
                            <th className="pb-3 pr-6 text-gray-300 font-medium">
                              Organization
                            </th>
                            <th className="pb-3 px-6 text-gray-300 font-medium">
                              Users
                            </th>
                            <th className="pb-3 px-6 text-gray-300 font-medium">
                              Projects
                            </th>
                            <th className="pb-3 px-6 text-gray-300 font-medium">
                              Storage
                            </th>
                            <th className="pb-3 px-6 text-gray-300 font-medium">
                              Status
                            </th>
                            <th className="pb-3 pl-6 text-gray-300 font-medium"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {organizations.map((org) => (
                            <tr
                              key={org.id}
                              className="border-b border-gray-700"
                            >
                              <td className="py-3 pr-6">
                                <div className="font-medium text-white">
                                  {org.name}
                                </div>
                                <div className="text-xs text-gray-300">
                                  {org.id}
                                </div>
                              </td>
                              <td className="py-3 px-6 text-white">
                                {org.active_users} / {org.total_users}
                              </td>
                              <td className="py-3 px-6 text-white">
                                {org.projects}
                              </td>
                              <td className="py-3 px-6 text-white">
                                {org.storage_usage.toFixed(1)} GB
                              </td>
                              <td className="py-3 px-6">
                                <Badge
                                  className={
                                    org.status === "active"
                                      ? "bg-green-500/20 text-green-400 border-green-500"
                                      : org.status === "suspended"
                                      ? "bg-red-500/20 text-red-400 border-red-500"
                                      : "bg-gray-500/20 text-gray-300 border-gray-500"
                                  }
                                >
                                  {org.status.toUpperCase()}
                                </Badge>
                              </td>
                              <td className="py-3 pl-6 text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 px-2 text-white hover:bg-gray-700"
                                >
                                  Manage
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center p-4 text-gray-300">
                      No organizations found.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="mt-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl text-white">
                  System Alerts
                </CardTitle>
                <div className="flex gap-2">
                  <Badge className="bg-red-500/20 text-red-400 border-red-500">
                    {stats?.system_alerts.critical} Critical
                  </Badge>
                  <Badge className="bg-amber-500/20 text-amber-400 border-amber-500">
                    {stats?.system_alerts.warning} Warning
                  </Badge>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500">
                    {stats?.system_alerts.info} Info
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemAlerts.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-gray-700">
                            <th className="pb-3 pr-6 text-gray-300 font-medium">
                              Status
                            </th>
                            <th className="pb-3 pr-6 text-gray-300 font-medium">
                              Level
                            </th>
                            <th className="pb-3 px-6 text-gray-300 font-medium">
                              Message
                            </th>
                            <th className="pb-3 px-6 text-gray-300 font-medium">
                              Time
                            </th>
                            <th className="pb-3 pl-6 text-gray-300 font-medium"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {systemAlerts.map((alert) => (
                            <tr
                              key={alert.id}
                              className="border-b border-gray-700"
                            >
                              <td className="py-3 pr-6">
                                <Badge
                                  variant="outline"
                                  className={
                                    alert.is_resolved
                                      ? "border-green-500 text-green-400"
                                      : "border-amber-500 text-amber-400"
                                  }
                                >
                                  {alert.is_resolved ? "RESOLVED" : "ACTIVE"}
                                </Badge>
                              </td>
                              <td className="py-3 pr-6">
                                <Badge
                                  className={
                                    alert.level === "critical"
                                      ? "bg-red-500/20 text-red-400 border-red-500"
                                      : alert.level === "warning"
                                      ? "bg-amber-500/20 text-amber-400 border-amber-500"
                                      : "bg-blue-500/20 text-blue-400 border-blue-500"
                                  }
                                >
                                  {alert.level.toUpperCase()}
                                </Badge>
                              </td>
                              <td className="py-3 px-6 text-white">
                                {alert.message}
                              </td>
                              <td className="py-3 px-6 text-white">
                                {formatDate(alert.timestamp)}
                              </td>
                              <td className="py-3 pl-6 text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 px-2 text-white hover:bg-gray-700"
                                >
                                  {alert.is_resolved
                                    ? "View Details"
                                    : "Resolve"}
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center p-4 text-gray-300">
                      No system alerts found.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="mt-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl text-white">
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-gray-700">
                            <th className="pb-3 pr-6 text-gray-300 font-medium">
                              User
                            </th>
                            <th className="pb-3 px-6 text-gray-300 font-medium">
                              Action
                            </th>
                            <th className="pb-3 px-6 text-gray-300 font-medium">
                              Entity
                            </th>
                            <th className="pb-3 pl-6 text-gray-300 font-medium">
                              Time
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentActivity.map((activity) => (
                            <tr
                              key={activity.id}
                              className="border-b border-gray-700"
                            >
                              <td className="py-3 pr-6">
                                <div className="flex items-center gap-2">
                                  <div className="bg-gray-700 p-1 rounded-full">
                                    <CircleUser className="h-4 w-4" />
                                  </div>
                                  <span className="text-white">
                                    {activity.user}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-6 text-white">
                                {activity.action}
                              </td>
                              <td className="py-3 px-6">
                                <div className="text-white">
                                  {activity.entity}
                                </div>
                                <div className="text-xs text-gray-300">
                                  {activity.entity_type}
                                </div>
                              </td>
                              <td className="py-3 pl-6 text-white">
                                {formatDate(activity.timestamp)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center p-4 text-gray-300">
                      No recent activity found.
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full border-gray-600">
                  View Full Activity Log
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// OrgAdmin Dashboard Component
export const OrgAdminDashboard = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<OrgStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeTab, setActiveTab] = useState<string>("overview");

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [statsData, activityData, projectsData] = await Promise.all([
          fetchOrgStats(),
          fetchRecentOrgActivity(),
          fetchProjects(),
        ]);

        setStats(statsData);
        setRecentActivity(activityData);
        setProjects(projectsData);
      } catch (err) {
        setError("Failed to load organization dashboard data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading organization dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen p-8 bg-gray-900 text-white">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen p-8 bg-gray-900 text-white">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Organization Dashboard</h1>
            <p className="text-gray-300">Acme Corporation</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Settings className="h-4 w-4 mr-2" />
            Organization Settings
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4 flex flex-col items-center">
              <div className="rounded-full bg-blue-500/20 p-3 mb-2">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white">
                {stats?.active_users} / {stats?.total_users}
              </div>
              <p className="text-gray-300 text-sm">Active Users</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4 flex flex-col items-center">
              <div className="rounded-full bg-emerald-500/20 p-3 mb-2">
                <Briefcase className="h-6 w-6 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-white">
                {stats?.active_projects} / {stats?.total_projects}
              </div>
              <p className="text-gray-300 text-sm">Active Projects</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4 flex flex-col items-center">
              <div className="rounded-full bg-purple-500/20 p-3 mb-2">
                <CheckCircle className="h-6 w-6 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white">
                {stats?.task_completion_rate}%
              </div>
              <p className="text-gray-300 text-sm">Task Completion</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4 flex flex-col items-center">
              <div className="rounded-full bg-amber-500/20 p-3 mb-2">
                <Clock className="h-6 w-6 text-amber-400" />
              </div>
              <div className="text-2xl font-bold text-white">
                {stats?.overdue_tasks}
              </div>
              <p className="text-gray-300 text-sm">Overdue Tasks</p>
            </CardContent>
          </Card>
        </div>

        <Tabs
          defaultValue="overview"
          className="mb-6"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid grid-cols-3 gap-4 bg-gray-800">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <div className="grid grid-cols-3 gap-6">
              <Card className="bg-gray-800 border-gray-700 col-span-2">
                <CardHeader>
                  <CardTitle className="text-xl text-white">
                    Task Completion Trends
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={orgTaskData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis dataKey="name" stroke="#e0e0e0" />
                        <YAxis stroke="#e0e0e0" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#222",
                            borderColor: "#444",
                            color: "#fff",
                          }}
                          itemStyle={{ color: "#fff" }}
                          labelStyle={{ color: "#e0e0e0" }}
                        />
                        <Bar
                          dataKey="created"
                          fill="#3b82f6"
                          name="Tasks Created"
                        />
                        <Bar
                          dataKey="completed"
                          fill="#10b981"
                          name="Tasks Completed"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-xl text-white">
                    Resource Usage
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1 text-sm text-white">
                        <span>Storage Usage</span>
                        <span className="font-medium">
                          {stats?.storage_usage} / {stats?.total_storage} GB
                        </span>
                      </div>
                      <Progress
                        value={
                          ((stats?.storage_usage || 0) /
                            (stats?.total_storage || 1)) *
                          100
                        }
                        className="h-2 bg-gray-700"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1 text-sm text-white">
                        <span>User Capacity</span>
                        <span className="font-medium">
                          {stats?.total_users} / 200
                        </span>
                      </div>
                      <Progress
                        value={((stats?.total_users || 0) / 200) * 100}
                        className="h-2 bg-gray-700"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1 text-sm text-white">
                        <span>Project Capacity</span>
                        <span className="font-medium">
                          {stats?.total_projects} / 30
                        </span>
                      </div>
                      <Progress
                        value={((stats?.total_projects || 0) / 30) * 100}
                        className="h-2 bg-gray-700"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-base font-medium mb-2 text-white">
                      Recent Activity
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-white">
                        <span>Tasks Created</span>
                        <span className="font-medium">
                          {stats?.recent_activity.tasks_created}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-white">
                        <span>Tasks Completed</span>
                        <span className="font-medium">
                          {stats?.recent_activity.tasks_completed}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-white">
                        <span>Comments Added</span>
                        <span className="font-medium">
                          {stats?.recent_activity.comments_added}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="projects" className="mt-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl text-white">Projects</CardTitle>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Project
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-gray-700">
                            <th className="pb-3 pr-6 text-gray-300 font-medium">
                              Project Name
                            </th>
                            <th className="pb-3 px-6 text-gray-300 font-medium">
                              Progress
                            </th>
                            <th className="pb-3 px-6 text-gray-300 font-medium">
                              Tasks
                            </th>
                            <th className="pb-3 px-6 text-gray-300 font-medium">
                              Users
                            </th>
                            <th className="pb-3 px-6 text-gray-300 font-medium">
                              Status
                            </th>
                            <th className="pb-3 pl-6 text-gray-300 font-medium">
                              Last Activity
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {projects.map((project) => (
                            <tr
                              key={project.id}
                              className="border-b border-gray-700"
                            >
                              <td className="py-3 pr-6 font-medium text-white">
                                {project.name}
                              </td>
                              <td className="py-3 px-6">
                                <div className="flex items-center gap-2">
                                  <Progress
                                    value={project.progress}
                                    className="h-2 w-24 bg-gray-700"
                                  />
                                  <span className="text-white">
                                    {project.progress}%
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-6">
                                {project.active_tasks} / {project.total_tasks}
                              </td>
                              <td className="py-3 px-6 text-white">
                                {project.active_users}
                              </td>
                              <td className="py-3 px-6">
                                <Badge
                                  className={
                                    project.status === "active"
                                      ? "bg-green-500/20 text-green-400 border-green-500"
                                      : project.status === "completed"
                                      ? "bg-blue-500/20 text-blue-400 border-blue-500"
                                      : "bg-amber-500/20 text-amber-400 border-amber-500"
                                  }
                                >
                                  {project.status
                                    .replace("_", " ")
                                    .toUpperCase()}
                                </Badge>
                              </td>
                              <td className="py-3 pl-6 text-white">
                                {formatDate(project.last_activity)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center p-4 text-gray-300">
                      No projects found.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="mt-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl text-white">
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-gray-700">
                            <th className="pb-3 pr-6 text-gray-300 font-medium">
                              User
                            </th>
                            <th className="pb-3 px-6 text-gray-300 font-medium">
                              Action
                            </th>
                            <th className="pb-3 px-6 text-gray-300 font-medium">
                              Entity
                            </th>
                            <th className="pb-3 pl-6 text-gray-300 font-medium">
                              Time
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentActivity.map((activity) => (
                            <tr
                              key={activity.id}
                              className="border-b border-gray-700"
                            >
                              <td className="py-3 pr-6">
                                <div className="flex items-center gap-2">
                                  <div className="bg-gray-700 p-1 rounded-full">
                                    <CircleUser className="h-4 w-4" />
                                  </div>
                                  <span className="text-white">
                                    {activity.user}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-6 text-white">
                                {activity.action}
                              </td>
                              <td className="py-3 px-6">
                                <div className="text-white">
                                  {activity.entity}
                                </div>
                                <div className="text-xs text-gray-300">
                                  {activity.entity_type}
                                </div>
                              </td>
                              <td className="py-3 pl-6 text-white">
                                {formatDate(activity.timestamp)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center p-4 text-gray-300">
                      No recent activity found.
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full border-gray-600">
                  View Full Activity Log
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default { SystemAdminDashboard, OrgAdminDashboard };
