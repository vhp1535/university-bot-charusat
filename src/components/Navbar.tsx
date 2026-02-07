import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeProvider';
import { Button } from '@/components/ui/button';

export const Navbar: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const navItems = ['Home', 'About', 'Contact'];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6"
    >
      <div className="max-w-7xl mx-auto">
        <div className="scrapbook-card tape-effect flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="text-2xl font-bold gradient-text handwriting"
            whileHover={{ scale: 1.05, rotate: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            📝 Notebook LLM
          </motion.div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.a
                key={item}
                href="#"
                className="text-foreground/80 hover:text-foreground transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                {item}
              </motion.a>
            ))}
          </div>

          {/* Theme Toggle */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setTheme(theme === 'light' ? 'dark' : 'light');
              }}
              className="text-xs font-medium btn-scrapbook text-xs px-3 py-1"
            >
              {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};