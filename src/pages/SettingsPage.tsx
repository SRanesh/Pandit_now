import React from 'react';
import { SettingsHeader } from '../components/settings/SettingsHeader';
import { AccountSettings } from '../components/settings/AccountSettings';
import { NotificationSettings } from '../components/settings/NotificationSettings';
import { PrivacySettings } from '../components/settings/PrivacySettings';

export function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <SettingsHeader />
      <div className="space-y-8 mt-8">
        <AccountSettings />
        <NotificationSettings />
        <PrivacySettings />
      </div>
    </div>
  );
}