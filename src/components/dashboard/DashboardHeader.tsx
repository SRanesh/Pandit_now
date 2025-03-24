import React from 'react';
import { User } from '../../types/auth';

interface DashboardHeaderProps {
  user: User;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const greeting = `Welcome${user.name ? `, ${user.name}` : ''}`;
  const subtitle = user.role === 'pandit' 
    ? 'Manage your ceremonies and connect with devotees'
    : 'Find and book pandits for your ceremonies';

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{greeting}</h1>
      <p className="text-gray-600">{subtitle}</p>
    </div>
  );
}