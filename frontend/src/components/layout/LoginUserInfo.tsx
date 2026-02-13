'use client';

import { Icon } from '@iconify/react';
import { logoutAction } from '@/app/actions/auth';
import { useRouter } from 'next/navigation';

type User = {
  id: number;
  username: string;
};

interface LoginUserInfoProps {
  user: User;
}

export function LoginUserInfo({ user }: LoginUserInfoProps) {
  const router = useRouter();

  const firstLetter = user.username.charAt(0).toUpperCase();

  const handleLogout = async () => {
    try {
      await logoutAction();
    } catch (error) {
      console.warn('Logout error (ignored):', error);
    } finally {
      router.push('/login');
    }
  };

  return (
    <div className="bg-transparent rounded-xl border border-gray-200 w-full p-4 pb-5 shadow-lg">
      <div className="flex items-center gap-3 p-3">
        <div className="relative">
          <div
            className="
              w-12 h-12 rounded-full bg-rose-600 border border-gray-200
              flex items-center justify-center text-lg font-semibold text-white
            "
          >
            {firstLetter}
          </div>
        </div>
        <p className="text-lg font-semibold text-gray-900">
          {user.username}
        </p>
      </div>
      {/* ログアウトボタンを下に配置 */}
      <button
        onClick={handleLogout}
        className="
          relative w-full mt-4 group bg-white flex items-center justify-center gap-2 px-5 py-3
          text-sm font-medium text-gray-900 hover:text-gray-900 hover:bg-gray-100
          rounded-full border border-black transition-all duration-200
        "
      >
        <Icon
          icon="solar:logout-linear"
          width={18}
          strokeWidth={1.5}
          className="absolute left-8 text-gray-900 group-hover:text-gray-900"
        />
        ログアウト
      </button>
    </div>
  );
}
