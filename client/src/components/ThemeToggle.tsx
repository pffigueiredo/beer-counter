import { Switch } from '@/components/ui/switch';
import { useTheme } from './ThemeProvider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-100 dark:bg-slate-800 border border-amber-200 dark:border-slate-700">
      <span className="text-2xl">☀️</span>
      <Switch
        checked={theme === 'dark'}
        onCheckedChange={toggleTheme}
        className="data-[state=checked]:bg-slate-600 data-[state=unchecked]:bg-amber-400"
      />
      <span className="text-2xl">🌙</span>
      <span className="text-sm font-medium text-amber-800 dark:text-slate-200">
        {theme === 'light' ? 'Light' : 'Dark'} Mode
      </span>
    </div>
  );
}