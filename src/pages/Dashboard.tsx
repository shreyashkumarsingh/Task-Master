
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
    const date = new Date(dateString);
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    if (dateString === today) return 'Today';
    if (dateString === tomorrow) return 'Tomorrow';
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      {/* Compact Header */}
      <div className="flex items-center justify-between pb-2">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-sm text-muted-foreground">
            Here's what's happening with your tasks today.
          </p>
        </div>
        <Link to="/tasks">
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </Link>
      </div>

      {/* Compact Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Total Tasks</p>
              <p className="text-lg font-bold">{stats.total}</p>
            </div>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Today</p>
              <p className="text-lg font-bold">{stats.today}</p>
            </div>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Overdue</p>
              <p className="text-lg font-bold text-destructive">{stats.overdue}</p>
            </div>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Completion</p>
              <p className="text-lg font-bold">{stats.completionRate.toFixed(0)}%</p>
            </div>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Upcoming Tasks - Takes 2 columns */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              Upcoming Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {upcomingTasks.length > 0 ? (
              <>
                {upcomingTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-2 rounded border hover:bg-accent/50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{task.title}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant={getPriorityColor(task.priority)} className="text-xs py-0 px-1">
                          {task.priority}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {task.dueDate && formatDate(task.dueDate)}
                          {task.dueTime && ` at ${task.dueTime}`}
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs ml-2">
                      {task.category}
                    </Badge>
                  </div>
                ))}
                <Link to="/tasks">
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    View All Tasks
                  </Button>
                </Link>
              </>
            ) : (
              <div className="text-center py-6">
                <ListTodo className="mx-auto h-8 w-8 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground mt-2">No upcoming tasks</p>
                <Link to="/tasks">
                  <Button variant="outline" size="sm" className="mt-2">
                    Create Task
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Completion Rate</span>
                  <span>{stats.completionRate.toFixed(0)}%</span>
                </div>
                <Progress value={stats.completionRate} className="h-2" />
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 bg-green-50 dark:bg-green-950 rounded">
                  <p className="text-lg font-bold text-green-600">{stats.completed}</p>
                  <p className="text-xs text-green-700 dark:text-green-400">Completed</p>
                </div>
                <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded">
                  <p className="text-lg font-bold text-blue-600">{stats.pending}</p>
                  <p className="text-xs text-blue-700 dark:text-blue-400">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Priority Tasks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">High Priority</span>
                <Badge variant="destructive" className="text-xs">{stats.highPriority}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Tomorrow</span>
                <Badge variant="outline" className="text-xs">{stats.tomorrow}</Badge>
              </div>
              
              <div className="pt-2 border-t">
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/tasks" className="w-full">
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      Add Task
                    </Button>
                  </Link>
                  <Link to="/calendar" className="w-full">
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      Calendar
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      {recentTasks.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Target className="mr-2 h-4 w-4" />
              Recently Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
              {recentTasks.map((task) => (
                <div key={task.id} className="p-2 bg-green-50 dark:bg-green-950 rounded border border-green-200 dark:border-green-800">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
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
