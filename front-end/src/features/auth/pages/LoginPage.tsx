import { LoginForm } from "./LoginForm";

export function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50">
      <div className="w-full max-w-md p-4">
        <LoginForm />
      </div>
    </div>
  );
}

export default LoginPage;
