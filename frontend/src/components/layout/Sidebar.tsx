'use client';

import Image from 'next/image';
import { LoginUserInfo } from './LoginUserInfo';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

type User = {
  id: number;
  username: string;
};

type SidebarProps = {
  user: User;
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname.includes(path);

  return (
      <aside className='w-72 bg-transparent p-3'>
        <div className="hidden bg-white w-72 md:flex flex-col z-20 h-full rounded-3xl shadow-sm">
          <div className="p-4 flex flex-col justify-between h-full">
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-2 items-center justify-center px-2 mt-10">
                <p className='text-center text-[10px]'>プリント作成をもっと手軽に。</p>
                <Image src="/logo.svg" alt="printex" width={160} height={140} />
              </div>
              <nav className="space-y-2">
                <Link
                  href="/project"
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                    isActive('/project')
                      ? 'bg-gray-100 text-gray-900 font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Image
                    src="/Home.svg"
                    alt="ホーム"
                    width={40}
                    height={40}
                    className={`transition-all duration-200 ${
                      isActive('/project') ? '' : 'opacity-50 grayscale'
                    }`}
                  />
                  <span className="text-lg">ホーム</span>
                </Link>
                <Link
                  href="/template"
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                    isActive('/template')
                      ? 'bg-gray-100 text-gray-900 font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Image
                    src="/Pencil.svg"
                    alt="テンプレート"
                    width={40}
                    height={40}
                    className={`transition-all duration-200 ${
                      isActive('/template') ? '' : 'opacity-50 grayscale'
                    }`}
                  />
                  <span className="text-lg">テンプレート</span>
                </Link>
                <Link
                  href="/trash"
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                    isActive('/trash')
                      ? 'bg-gray-100 text-gray-900 font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Image
                    src="/Trash.svg"
                    alt="ゴミ箱"
                    width={40}
                    height={40}
                    className={`transition-all duration-200 ${
                      isActive('/trash') ? '' : 'opacity-50 grayscale'
                    }`}
                  />
                  <span className="text-lg">ゴミ箱</span>
                </Link>
                <Link
                  href="/settings"
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                    isActive('/settings')
                      ? 'bg-gray-100 text-gray-900 font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Image
                    src="/Settings.svg"
                    alt="設定"
                    width={40}
                    height={40}
                    className={`transition-all duration-200 ${
                      isActive('/settings') ? '' : 'opacity-50 grayscale'
                    }`}
                  />
                  <span className="text-lg">設定</span>
                </Link>
              </nav>
            </div>
            <div className="">
              <LoginUserInfo user={user} />
            </div>
          </div>
        </div>
      </aside>
  );
}
