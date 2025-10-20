import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Calendar, Edit2, Trash2, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description?: string;
    priority: "low" | "medium" | "high";
    due_date?: string;
    completed: boolean;
  };
  onToggle: (id: string, completed: boolean) => void;
  onEdit: (task: any) => void;
  onDelete: (id: string) => void;
}

const priorityColors = {
  low: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  medium: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
  high: "bg-gradient-to-r from-accent/10 to-destructive/10 text-accent dark:text-accent border-accent/20",
};

export const TaskCard = ({ task, onToggle, onEdit, onDelete }: TaskCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className={cn(
        "p-4 transition-all duration-300 hover:shadow-[var(--shadow-card)] border-border/50 hover-lift",
        task.completed && "opacity-60"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-3">
        <div className="flex items-center gap-3 flex-1">
          <GripVertical className="h-5 w-5 text-muted-foreground/50 flex-shrink-0" />
          <Checkbox
            checked={task.completed}
            onCheckedChange={(checked) => onToggle(task.id, checked as boolean)}
            className="mt-1"
          />
          <div className="flex-1 min-w-0">
            <h3
              className={cn(
                "font-semibold text-foreground transition-all",
                task.completed && "line-through text-muted-foreground"
              )}
            >
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {task.description}
              </p>
            )}
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="outline" className={priorityColors[task.priority]}>
                {task.priority}
              </Badge>
              {task.due_date && (
                <Badge variant="outline" className="gap-1">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(task.due_date), "MMM d, yyyy")}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div
          className={cn(
            "flex gap-1 transition-opacity",
            isHovered ? "opacity-100" : "opacity-0"
          )}
        >
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onEdit(task)}
            className="h-8 w-8 hover:bg-primary/10 hover:text-primary hover-lift animate-bounce-in"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onDelete(task.id)}
            className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive hover-lift animate-bounce-in"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
