
import { useState, useMemo } from "react";
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
  Circle
} from "lucide-react";

const Calendar = () => {
  const { tasks, toggleTaskComplete } = useTasks();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');

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
    const dateString = date.toISOString().split('T')[0];
    return tasks.filter(task => task.dueDate === dateString);
  };

  const generateCalendarDays = () => {
    if (view === 'week') {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      
      const days = [];
      for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        days.push(day);
      }
      return days;
    } else {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const startDate = new Date(firstDay);
      startDate.setDate(firstDay.getDate() - firstDay.getDay());
      
      const days = [];
      const totalDays = 42; // 6 weeks * 7 days
      
      for (let i = 0; i < totalDays; i++) {
        const day = new Date(startDate);
        day.setDate(startDate.getDate() + i);
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
    let classes = "min-h-[120px] p-2 border border-border";
    
    if (view === 'month') {
      if (!isCurrentMonth(date)) {
        classes += " bg-muted/30 text-muted-foreground";
      }
    }
    
    if (isToday(date)) {
      classes += " bg-primary/10 border-primary";
    }
    
    return classes;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-muted-foreground mt-1">
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
        </div>
      </div>

      {/* Navigation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={navigatePrevious}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-xl font-semibold">{navigationDate}</h2>
            </div>
            
            <Button variant="outline" size="sm" onClick={navigateNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-0">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 border-b border-border">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-4 text-center font-medium text-muted-foreground border-r border-border last:border-r-0">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className={`grid grid-cols-7 ${view === 'week' ? 'min-h-[400px]' : ''}`}>
            {calendarDays.map((date, index) => {
              const dayTasks = getTasksForDate(date);
              
              return (
                <div key={index} className={getDayClasses(date)}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium ${
                      isToday(date) ? 'text-primary font-bold' : 
                      view === 'month' && !isCurrentMonth(date) ? 'text-muted-foreground' : ''
                    }`}>
                      {date.getDate()}
                    </span>
                    {dayTasks.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {dayTasks.length}
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-1">
                    {dayTasks.slice(0, view === 'week' ? 10 : 3).map((task) => (
                      <div
                        key={task.id}
                        className="p-1 rounded text-xs bg-background/80 border border-border/50 hover:bg-accent/50 transition-colors cursor-pointer"
                        onClick={() => toggleTaskComplete(task.id)}
                      >
                        <div className="flex items-start space-x-1">
                          {task.completed ? (
                            <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                          ) : (
                            <Circle className="h-3 w-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className={`truncate ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                              {task.title}
                            </p>
                            <div className="flex items-center space-x-1 mt-0.5">
                              <Badge variant={getPriorityColor(task.priority)} className="text-xs scale-75 origin-left">
                                {task.priority}
                              </Badge>
                              {task.dueTime && (
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <Clock className="mr-0.5 h-2 w-2" />
                                  {task.dueTime}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {dayTasks.length > (view === 'week' ? 10 : 3) && (
                      <div className="text-xs text-muted-foreground text-center">
                        +{dayTasks.length - (view === 'week' ? 10 : 3)} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Today's Tasks Summary */}
      {view === 'month' && (
        <Card>
          <CardHeader>
            <CardTitle>Today's Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {getTasksForDate(new Date()).length > 0 ? (
              <div className="space-y-2">
                {getTasksForDate(new Date()).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center space-x-3 p-2 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
                    onClick={() => toggleTaskComplete(task.id)}
                  >
                    {task.completed ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                    <div className="flex-1">
                      <p className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {task.title}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant={getPriorityColor(task.priority)} className="text-xs">
                          {task.priority}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {task.category}
                        </Badge>
                        {task.dueTime && (
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="mr-1 h-3 w-3" />
                            {task.dueTime}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="text-muted-foreground mt-2">No tasks scheduled for today</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Calendar;
