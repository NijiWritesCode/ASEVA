import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export function Breadcrumbs({ items = [], className = '' }) {
  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumbs"
      className={`flex items-center space-x-1.5 text-xs text-obsidian-500 ${className}`}
    >
      <Link
        to="/dashboard"
        className="hover:text-obsidian-950 transition-colors p-0.5 rounded flex items-center"
      >
        <Home className="w-3.5 h-3.5" />
        <span className="sr-only">Dashboard Home</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3 h-3 text-sand-400 shrink-0" />
            {isLast || !item.href ? (
              <span className="font-semibold text-obsidian-900 truncate">
                {item.label}
              </span>
            ) : (
              <Link
                to={item.href}
                className="hover:text-obsidian-900 transition-colors truncate"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
