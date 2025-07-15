import { useState, useMemo, useEffect } from "react";
import { useTasks } from "@/contexts/TaskContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  Circle,
  Plus
} from "lucide-react";
import { Link } from "react-router-dom";
import { formatLocalDate } from "@/lib/dateUtils";

// Debug function to help identify date issues
const debugDateHandling = () => {
  const today = new Date();
  console.log('Debug Date Handling:');
  console.log('Current date:', today);
  console.log('formatLocalDate(today):', formatLocalDate(today));
  console.log('today.toISOString():', today.toISOString());
  console.log('today.toDateString():', today.toDateString());
  console.log('today.toLocaleDateString():', today.toLocaleDateString());
};

const Calendar = () => {
  const { tasks, toggleTaskComplete } = useTasks();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');

  // Debug date handling on component mount
  useEffect(() => {
    debugDateHandling();
  }, []);

  const navigationDate = useMemo(() => {
    if (view === 'month') {
      return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } else {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
  }, [currentDate, view]);

  const navigatePrevious = () => {
    if (view === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() - 7);
      setCurrentDate(newDate);
    }
  };

  const navigateNext = () => {
    if (view === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + 7);
      setCurrentDate(newDate);
    }
  };

  const getTasksForDate = (date: Date) => {
    // Ensure we're comparing dates in local timezone consistently
    const targetDateString = formatLocalDate(date);
    
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      
      // Normalize both dates to ensure consistent comparison
      const taskDateString = task.dueDate;
      
      // Log for debugging (can be removed later)
      if (tasks.length > 0) {
        console.log(`Comparing task date "${taskDateString}" with calendar date "${targetDateString}"`);
      }
      
      return taskDateString === targetDateString;
    });
  };

  const generateCalendarDays = () => {
    if (view === 'week') {
      const days = [];
      // Create a clean date for the start of week calculation
      const baseDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
      const dayOfWeek = baseDate.getDay();
      
      for (let i = 0; i < 7; i++) {
        // Calculate offset from Sunday (0) to get the correct week
        const dayOffset = i - dayOfWeek;
        const day = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() + dayOffset);
        days.push(day);
      }
      return days;
    } else {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      
      // Get first day of the month
      const firstDayOfMonth = new Date(year, month, 1);
      const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday, etc.
      
      // Calculate how many days to go back to get to the start of the calendar grid
      const startDateOffset = -firstDayOfWeek;
      
      const days = [];
      const totalDays = 42; // 6 weeks * 7 days
      
      for (let i = 0; i < totalDays; i++) {
        // Create each day from the first of the month with proper offset
        const day = new Date(year, month, 1 + startDateOffset + i);
        days.push(day);
      }
      
      return days;
    }
  };

  const calendarDays = generateCalendarDays();

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getDayClasses = (date: Date) => {
    let classes = "border border-border transition-colors hover:bg-accent/30";
    
    if (view === 'month') {
      classes += " min-h-[80px] p-1";
      if (!isCurrentMonth(date)) {
        classes += " bg-muted/30 text-muted-foreground";
      }
    } else {
      classes += " min-h-[120px] p-2";
    }
    
    if (isToday(date)) {
      classes += " bg-primary/10 border-primary";
    }
    
    return classes;
  };

  const todayTasks = getTasksForDate(new Date());

  return (
    <div className="space-y-2 max-w-6xl mx-auto px-2 sm:px-4">
      {/* Compact Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Calendar</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            View your tasks organized by date
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={view === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('month')}
          >
            Month
          </Button>
          <Button
            variant={view === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('week')}
          >
            Week
          </Button>
          <Link to="/tasks">
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between p-2 bg-card rounded-lg border">
        <Button variant="outline" size="sm" onClick={navigatePrevious}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-lg font-semibold">{navigationDate}</h2>
        </div>
        
        <Button variant="outline" size="sm" onClick={navigateNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 items-start">
        {/* Calendar Grid - Takes 3 columns */}
        <Card className="lg:col-span-3">
          <CardContent className="p-0">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 border-b border-border">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-2 text-center font-medium text-muted-foreground border-r border-border last:border-r-0 text-sm">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7">
              {calendarDays.map((date, index) => {
                const dayTasks = getTasksForDate(date);
                
                return (
                  <div key={index} className={getDayClasses(date)}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-medium ${
                        isToday(date) ? 'text-primary font-bold' : 
                        view === 'month' && !isCurrentMonth(date) ? 'text-muted-foreground' : ''
                      }`}>
                        {date.getDate()}
                      </span>
                      {dayTasks.length > 0 && (
                        <Badge variant="secondary" className="text-xs scale-75 origin-right">
                          {dayTasks.length}
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-0.5">
                      {dayTasks.slice(0, view === 'week' ? 8 : 2).map((task) => (
                        <div
                          key={task.id}
                          className="p-0.5 rounded text-xs bg-background/80 border border-border/50 hover:bg-accent/50 transition-colors cursor-pointer"
                          onClick={() => toggleTaskComplete(task.id)}
                        >
                          <div className="flex items-start space-x-1">
                            {task.completed ? (
                              <CheckCircle className="h-2 w-2 text-green-600 mt-0.5 flex-shrink-0" />
                            ) : (
                              <Circle className="h-2 w-2 text-muted-foreground mt-0.5 flex-shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className={`truncate text-xs leading-tight ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                                {task.title}
                              </p>
                              {view === 'week' && (
                                <div className="flex items-center space-x-1 mt-0.5">
                                  <Badge variant={getPriorityColor(task.priority)} className="text-xs scale-50 origin-left">
                                    {task.priority}
                                  </Badge>
                                  {task.dueTime && (
                                    <div className="flex items-center text-xs text-muted-foreground">
                                      <Clock className="mr-0.5 h-2 w-2" />
                                      {task.dueTime}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {dayTasks.length > (view === 'week' ? 8 : 2) && (
                        <div className="text-xs text-muted-foreground text-center">
                          +{dayTasks.length - (view === 'week' ? 8 : 2)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Today's Tasks Sidebar */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Today's Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {todayTasks.length > 0 ? (
              <div className="space-y-2">
                {todayTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start space-x-2 p-2 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
                    onClick={() => toggleTaskComplete(task.id)}
                  >
                    {task.completed ? (
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {task.title}
                      </p>
                      <div className="flex items-center space-x-1 mt-1">
                        <Badge variant={getPriorityColor(task.priority)} className="text-xs py-0 px-1">
                          {task.priority}
                        </Badge>
                        <Badge variant="outline" className="text-xs py-0 px-1">
                          {task.category}
                        </Badge>
                      </div>
                      {task.dueTime && (
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <Clock className="mr-1 h-3 w-3" />
                          {task.dueTime}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <CalendarIcon className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">No tasks scheduled for today</p>
                <Link to="/tasks">
                  <Button variant="outline" size="sm" className="mt-2">
                    Add Task
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Calendar;
