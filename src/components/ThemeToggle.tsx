import { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

export type ThemeMode = 'light' | 'dark' | 'system';

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('wnel_theme') as ThemeMode;
    return saved || 'system';
  });
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const applyThemeToDocument = (t: ThemeMode) => {
    const root = document.documentElement;
    let isDark = false;
    if (t === 'dark') {
      isDark = true;
    } else if (t === 'light') {
      isDark = false;
    } else {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  const handleSelectTheme = (t: ThemeMode) => {
    setTheme(t);
    localStorage.setItem('wnel_theme', t);
    applyThemeToDocument(t);
    setIsOpen(false);
  };

  // Apply theme to document
  useEffect(() => {
    applyThemeToDocument(theme);
    localStorage.setItem('wnel_theme', theme);

    // Listen for system theme changes if in system mode
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyThemeToDocument('system');
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = () => {
    if (theme === 'light') return <Sun className="w-4 h-4 text-amber-500" />;
    if (theme === 'dark') return <Moon className="w-4 h-4 text-indigo-400" />;
    return <Monitor className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />;
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        id="theme-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Tema Değiştir (Açık / Koyu / Sistem)"
        className="p-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer flex items-center justify-center shadow-2xs"
      >
        {getIcon()}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-32 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl z-50 p-1 space-y-0.5">
          <button
            onClick={() => handleSelectTheme('light')}
            className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
              theme === 'light'
                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-semibold'
                : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span>Açık Tema</span>
          </button>

          <button
            onClick={() => handleSelectTheme('dark')}
            className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
              theme === 'dark'
                ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 font-semibold'
                : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Moon className="w-3.5 h-3.5 text-indigo-400" />
            <span>Koyu Tema</span>
          </button>

          <button
            onClick={() => handleSelectTheme('system')}
            className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
              theme === 'system'
                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold'
                : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Monitor className="w-3.5 h-3.5 text-zinc-500" />
            <span>Sistem</span>
          </button>
        </div>
      )}
    </div>
  );
}
