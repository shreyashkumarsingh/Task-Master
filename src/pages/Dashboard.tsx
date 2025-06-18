
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useTasks } from "@/contexts/TaskContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  TrendingUp
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const { tasks } = useTasks();

  const stats = useMemo(() => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const completedTasks = tasks.filter(task => task.completed);
    const pendingTasks = tasks.filter(task => !task.completed);
    const todayTasks = tasks.filter(task => task.dueDate === today);
    const tomorrowTasks = tasks.filter(task => task.dueDate === tomorrow);
    const overdueTasks = tasks.filter(task => 
      !task.completed && task.dueDate && task.dueDate < today
    );
    const highPriorityTasks = tasks.filter(task => 
      !task.completed && task.priority === 'high'
    );

    const completionRate = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;

    return {
      total: tasks.length,
      completed: completedTasks.length,
      pending: pendingTasks.length,
      today: todayTasks.length,
      tomorrow: tomorrowTasks.length,
      overdue: overdueTasks.length,
      highPriority: highPriorityTasks.length,
      completionRate
    };
  }, [tasks]);

  const upcomingTasks = useMemo(() => {
    const now = new Date();
    const upcoming = tasks
      .filter(task => !task.completed && task.dueDate)
      .sort((a, b) => {
        const dateA = new Date(a.dueDate + (a.dueTime ? `T${a.dueTime}` : ''));
        const dateB = new Date(b.dueDate + (b.dueTime ? `T${b.dueTime}` : ''));
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, 5);
    
    return upcoming;
  }, [tasks]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    if (dateString === today) return 'Today';
    if (dateString === tomorrow) return 'Tomorrow';
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your tasks today.
          </p>
        </div>
        <Link to="/tasks">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.completed} completed, {stats.pending} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Tasks</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.today}</div>
            <p className="text-xs text-muted-foreground">
              Due today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.overdue}</div>
            <p className="text-xs text-muted-foreground">
              Need attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completionRate.toFixed(0)}%</div>
            <Progress value={stats.completionRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Upcoming Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingTasks.length > 0 ? (
              <div className="space-y-4">
                {upcomingTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex-1">
                      <h4 className="font-medium">{task.title}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant={getPriorityColor(task.priority)} className="text-xs">
                          {task.priority}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {task.dueDate && formatDate(task.dueDate)}
                          {task.dueTime && ` at ${task.dueTime}`}
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {task.category}
                    </Badge>
                  </div>
                ))}
                <Link to="/tasks">
                  <Button variant="outline" className="w-full">
                    View All Tasks
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="text-muted-foreground mt-2">No upcoming tasks</p>
                <Link to="/tasks">
                  <Button variant="outline" className="mt-4">
                    Create Your First Task
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">High Priority Tasks</span>
              <Badge variant="destructive">{stats.highPriority}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Tomorrow's Tasks</span>
              <Badge variant="outline">{stats.tomorrow}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Completed This Session</span>
              <Badge variant="secondary">{stats.completed}</Badge>
            </div>
            
            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Quick Actions</h4>
              <div className="flex space-x-2">
                <Link to="/tasks" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    Add Task
                  </Button>
                </Link>
                <Link to="/calendar" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    View Calendar
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
