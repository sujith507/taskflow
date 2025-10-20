import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TaskCard } from "@/components/tasks/TaskCard";
import { TaskForm, TaskFormData } from "@/components/tasks/TaskForm";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { tasksAPI } from "@/services/api";
import { Task } from "@/types";
import { LogOut, Plus, Filter } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "incomplete">("all");
  const [sortBy, setSortBy] = useState<"created" | "dueDate" | "priority">("created");

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate("/auth");
    } else {
      // Decode token to get user info (simple decode, not secure for production)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ email: payload.email || 'user' });
        fetchTasks();
      } catch (error) {
        localStorage.removeItem('token');
        navigate("/auth");
      }
    }
  }, [navigate]);

  const fetchTasks = async () => {
    try {
      const tasks = await tasksAPI.getTasks();
      setTasks(tasks);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch tasks",
      });
    }
  };

  const handleCreateTask = async (data: TaskFormData) => {
    try {
      await tasksAPI.createTask({
        title: data.title,
        description: data.description,
        priority: data.priority,
        dueDate: data.due_date?.toISOString(),
        completed: false,
      });
      toast({
        title: "Success",
        description: "Task created successfully",
      });
      fetchTasks();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to create task",
      });
    }
  };

  const handleUpdateTask = async (data: TaskFormData) => {
    if (!editingTask) return;

    try {
      await tasksAPI.updateTask(editingTask.id, {
        title: data.title,
        description: data.description,
        priority: data.priority,
        dueDate: data.due_date?.toISOString(),
      });
      toast({
        title: "Success",
        description: "Task updated successfully",
      });
      fetchTasks();
      setEditingTask(null);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to update task",
      });
    }
  };

  const handleToggleTask = async (id: string, completed: boolean) => {
    try {
      await tasksAPI.updateTask(id, { completed });
      fetchTasks();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to update task",
      });
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await tasksAPI.deleteTask(id);
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
      fetchTasks();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to delete task",
      });
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem('token');
    navigate("/auth");
  };

  const filteredTasks = tasks.filter((task) => {
    if (filterStatus === "completed") return task.completed;
    if (filterStatus === "incomplete") return !task.completed;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "priority") {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    if (sortBy === "dueDate") {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent animate-glitch" data-text="TaskFlow">
              TaskFlow
            </h1>
            <p className="text-muted-foreground mt-1">Welcome back, {user.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="outline"
              onClick={handleLogout}
              className="gap-2 hover-lift"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </header>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => {
              setEditingTask(null);
              setIsTaskFormOpen(true);
            }}
            className="gap-2 bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 transition-opacity hover-lift animate-pulse-glow"
          >
            <Plus className="h-4 w-4" />
            New Task
          </Button>

          <div className="flex gap-3 flex-1">
            <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
              <SelectTrigger className="w-full sm:w-[180px] hover-lift">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tasks</SelectItem>
                <SelectItem value="incomplete">Incomplete</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-full sm:w-[180px] hover-lift">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created">Sort by Created</SelectItem>
                <SelectItem value="due_date">Sort by Due Date</SelectItem>
                <SelectItem value="priority">Sort by Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-3">
          {sortedTasks.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <p className="text-muted-foreground text-lg">No tasks yet</p>
              <p className="text-sm text-muted-foreground">
                Create your first task to get started
              </p>
            </div>
          ) : (
            sortedTasks.map((task, index) => (
              <div key={task.id}>
                <TaskCard
                  task={task}
                  onToggle={handleToggleTask}
                  onEdit={(task) => {
                    setEditingTask(task);
                    setIsTaskFormOpen(true);
                  }}
                  onDelete={handleDeleteTask}
                />
              </div>
            ))
          )}
        </div>

        <TaskForm
          open={isTaskFormOpen}
          onOpenChange={(open) => {
            setIsTaskFormOpen(open);
            if (!open) setEditingTask(null);
          }}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          initialData={
            editingTask
              ? {
                  title: editingTask.title,
                  description: editingTask.description,
                  priority: editingTask.priority,
                  due_date: editingTask.dueDate ? new Date(editingTask.dueDate) : undefined,
                }
              : undefined
          }
          isEditing={!!editingTask}
        />
      </div>
    </div>
  );
};

export default Index;
