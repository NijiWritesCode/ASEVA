import React from 'react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  icon: Icon,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-obsidian-950 text-sand-50 hover:bg-obsidian-800 focus:ring-gold-500 border border-transparent shadow-sm',
    gold: 'bg-gold-500 text-obsidian-950 hover:bg-gold-400 font-semibold focus:ring-gold-400 shadow-sm',
    secondary: 'bg-sand-200 text-obsidian-900 hover:bg-sand-300 focus:ring-obsidian-500',
    outline: 'border border-obsidian-800 text-obsidian-900 hover:bg-obsidian-950 hover:text-sand-50 focus:ring-gold-500',
    ghost: 'text-obsidian-700 hover:text-obsidian-950 hover:bg-sand-200/50',
    danger: 'bg-red-700 text-white hover:bg-red-800 focus:ring-red-500',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 rounded-sm gap-1.5',
    md: 'text-xs tracking-wider uppercase px-5 py-2.5 rounded-sm gap-2',
    lg: 'text-sm tracking-widest uppercase px-7 py-3.5 rounded-sm gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </button>
  );
}
