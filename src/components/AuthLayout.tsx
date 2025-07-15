
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div className={`absolute inset-0 ${theme === 'dark' ? 'gradient-bg' : 'gradient-bg-light'}`} />
      
      <Button
        variant="outline"
        size="icon"
        onClick={toggleTheme}
        className="absolute top-4 right-4 z-10 bg-white/20 backdrop-blur-sm border-white/30"
      >
        {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">TaskMaster</h1>
          <p className="text-muted-foreground">Your personal productivity companion</p>
        </div>
        
        <div className={`${theme === 'dark' ? 'glass-dark' : 'glass'} rounded-xl p-8 shadow-2xl`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
