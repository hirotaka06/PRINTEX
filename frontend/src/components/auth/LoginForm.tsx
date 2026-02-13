"use client";

import { useAuth } from '@/hooks/useAuth';
import { useRef, useState } from 'react';

export const LoginForm = () => {
  const { login } = useAuth();
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    if (
      usernameRef.current &&
      passwordRef.current
    ) {
      setIsLoading(true);
      try {
        await login(usernameRef.current.value, passwordRef.current.value);
        setErrorMessage(null);
      } catch (e) {
        console.warn('Login failed:', e);
        setErrorMessage('ログインに失敗しました。もう一度お試しください。');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
      {errorMessage && (
        <div
          role="alert"
          className="w-full px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
        >
          <div className="flex items-start gap-2">
            <svg
              className="w-5 h-5 text-red-500 shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="username" className="text-sm text-black">
          ユーザー名
        </label>
        <input
          id="username"
          type="text"
          placeholder="ユーザー名を入力"
          ref={usernameRef}
          required
          className="w-full px-0 py-2 bg-transparent border-0 border-b border-gray-300 rounded-none focus:outline-none focus:border-gray-500 text-black placeholder:text-gray-400"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-sm text-black">
          パスワード
        </label>
        <input
          id="password"
          type="password"
          placeholder="パスワードを入力"
          ref={passwordRef}
          required
          minLength={8}
          className="w-full px-0 py-2 bg-transparent border-0 border-b border-gray-300 rounded-none focus:outline-none focus:border-gray-500 text-black placeholder:text-gray-400"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full px-6 py-3 bg-gray-900 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all duration-200 font-medium shadow-sm ${
          isLoading
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-gray-800 cursor-pointer'
        }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            ログイン中...
          </span>
        ) : (
          'ログイン'
        )}
      </button>

      <a
        href="#"
        className="flex items-center justify-center gap-2 text-sm text-black hover:text-gray-600 transition-colors"
      >
        <span>ユーザー名/パスワードを忘れた方</span>
        <svg
          className="w-5 h-5 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </a>
    </form>
  );
};
