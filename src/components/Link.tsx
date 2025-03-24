import React from 'react';

interface LinkProps {
  href: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  variant?: 'default' | 'danger';
  isActive?: boolean;
  onClick?: () => void;
}

export function Link({ 
  href, 
  icon, 
  children, 
  variant = 'default',
  isActive = false,
  onClick
}: LinkProps) {
  const baseStyles = "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors";
  const variantStyles = {
    default: isActive 
      ? "bg-orange-50 text-orange-600" 
      : "text-gray-700 hover:bg-orange-50 hover:text-orange-600",
    danger: "text-red-600 hover:bg-red-50"
  };

  return (
    <a 
      href={href} 
      className={`${baseStyles} ${variantStyles[variant]}`}
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
      }}
    >
      {icon}
      {children}
    </a>
  );
}