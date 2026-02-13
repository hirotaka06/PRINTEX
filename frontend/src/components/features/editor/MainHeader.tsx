'use client';

import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';

interface MainHeaderProps {
  projectName: string;
}

export function MainHeader({
  projectName,
}: MainHeaderProps) {
  const router = useRouter();

  const handleProjectClick = () => {
    router.push('/project');
  };

  return (
    <header className="rounded-xl bg-linear-to-br from-sky-500 to-rose-400 flex items-center justify-between px-6 py-3 h-16 mb-4 shrink-0 z-10">
      <div className="flex items-center gap-3">
        <div className="md:hidden text-white">
          <Icon icon="solar:hamburger-menu-linear" width={24} />
        </div>
        <div className="flex items-center gap-2">
          <span
            onClick={handleProjectClick}
            className="text-sm text-white hover:text-gray-900 hover:underline cursor-pointer transition-colors duration-200"
          >
            プロジェクト
          </span>
          <Icon icon="solar:alt-arrow-right-linear" width={14} className="text-white" />
          <h1 className="text-2xl font-semibold text-white">{projectName}</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="bg-white hidden sm:flex items-center px-6 py-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:underline rounded-full transition-all duration-200 shadow-sm">
          <Icon icon="solar:download-linear" width={16} className='mr-2'  />
          <span className='tracking-wider'>PDF</span>
          ダウンロード
        </button>
      </div>
    </header>
  );
}
