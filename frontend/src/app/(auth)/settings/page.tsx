'use client';

import { Icon } from '@iconify/react';

export default function SettingsPage() {
  return (
    <>
      <header className="rounded-xl bg-linear-to-br from-sky-500 to-rose-400 flex items-center justify-between px-6 py-3 h-16 mb-4 shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="md:hidden text-white">
            <Icon icon="solar:hamburger-menu-linear" width={24} />
          </div>
          <h1 className="text-2xl font-semibold text-white">設定</h1>
        </div>
      </header>
      <div className="flex-1 flex items-center justify-center bg-white rounded-2xl shadow-sm">
        <div className="text-center">
          <p className="text-gray-600">設定機能は準備中です</p>
        </div>
      </div>
    </>
  );
}
