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
  TrendingUp,
  Target,
  ListTodo
} from "lucide-react";
import { getTodayString, getTomorrowString, compareDates } from "@/lib/dateUtils";

const Dashboard = () => {
  const { user } = useAuth();
  const { tasks } = useTasks();

  const stats = useMemo(() => {
    const today = getTodayString();
    const tomorrow = getTomorrowString();

    const completedTasks = tasks.filter(task => task.completed);
    const pendingTasks = tasks.filter(task => !task.completed);
    const todayTasks = tasks.filter(task => task.dueDate === today);
    const tomorrowTasks = tasks.filter(task => task.dueDate === tomorrow);
    const overdueTasks = tasks.filter(task => 
      !task.completed && task.dueDate && compareDates(task.dueDate, today) < 0
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
      .slice(0, 6);
    
    return upcoming;
  }, [tasks]);

  const recentTasks = useMemo(() => {
    return tasks
      .filter(task => task.completed)
      .sort((a, b) => b.id.localeCompare(a.id))
      .slice(0, 4);
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
    if (!dateString) return '';
    
    const today = getTodayString();
    const tomorrow = getTomorrowString();

    if (dateString === today) return 'Today';
    if (dateString === tomorrow) return 'Tomorrow';
    
    // Parse the date string and format it nicely
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString();
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today</p>
                <p className="text-2xl font-bold">{stats.today}</p>
              </div>
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold text-destructive">{stats.overdue}</p>
              </div>
              <AlertCircle className="h-5 w-5 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completion</p>
                <p className="text-2xl font-bold">{stats.completionRate.toFixed(0)}%</p>
              </div>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Tasks - Takes 2 columns */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Upcoming Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingTasks.length > 0 ? (
              <>
                {upcomingTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{task.title}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant={getPriorityColor(task.priority)} className="text-xs">
                          {task.priority}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {task.dueDate && formatDate(task.dueDate)}
                          {task.dueTime && ` at ${task.dueTime}`}
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline" className="ml-3">
                      {task.category}
                    </Badge>
                  </div>
                ))}
                <Link to="/tasks" className="block">
                  <Button variant="outline" className="w-full">
                    View All Tasks
                  </Button>
                </Link>
              </>
            ) : (
              <div className="text-center py-8">
                <ListTodo className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="text-muted-foreground mt-2">No upcoming tasks</p>
                <Link to="/tasks">
                  <Button variant="outline" className="mt-3">
                    Create Task
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Completion Rate</span>
                  <span>{stats.completionRate.toFixed(0)}%</span>
                </div>
                <Progress value={stats.completionRate} className="h-2" />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                  <p className="text-xs text-green-700 dark:text-green-400">Completed</p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg text-center">
                  <p className="text-2xl font-bold text-blue-600">{stats.pending}</p>
                  <p className="text-xs text-blue-700 dark:text-blue-400">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Priority Tasks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">High Priority</span>
                <Badge variant="destructive">{stats.highPriority}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Tomorrow</span>
                <Badge variant="outline">{stats.tomorrow}</Badge>
              </div>
              
              <div className="pt-3 border-t space-y-2">
                <Link to="/tasks" className="block">
                  <Button variant="outline" size="sm" className="w-full">
                    Add Task
                  </Button>
                </Link>
                <Link to="/calendar" className="block">
                  <Button variant="outline" size="sm" className="w-full">
                    Calendar
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      {recentTasks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="mr-2 h-5 w-5" />
              Recently Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {recentTasks.map((task) => (
                <div key={task.id} className="p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <p className="text-sm font-medium text-green-700 dark:text-green-400 truncate">
                      {task.title}
                    </p>
                  </div>
                  <p className="text-xs text-green-600 mt-1">{task.category}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
