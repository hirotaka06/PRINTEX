import { LoginForm } from '@/components/auth';

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">
        <h1 className="mb-8 text-2xl font-bold text-black">ログイン</h1>
        <LoginForm />
      </div>
    </div>
  );
}
