import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { authService } from '../services/auth.service';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const performLogin = async () => {
    try {
      // Chamar o serviço de autenticação
      const response = await authService.login({ email, password });

      // Salvar o token
      authService.setToken(response.access_token);

      // Mostrar mensagem de sucesso
      setSuccess(true);
      setIsLoading(false);

      // Redirecionar para o dashboard após 1.5 segundos
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err: any) {
      console.error('Login error:', err);
      setIsLoading(false);

      // Tratar diferentes tipos de erro
      if (err.response?.status === 401) {
        setError('Email ou senha incorretos');
      } else if (err.response?.status === 400) {
        setError('Dados inválidos. Verifique os campos e tente novamente');
      } else if (err.code === 'ERR_NETWORK') {
        setError(
          'Erro de conexão. Verifique sua internet ou se o servidor está rodando'
        );
      } else {
        setError(
          err.response?.data?.message || 'Erro ao fazer login. Tente novamente'
        );
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    console.log('=== FORM SUBMITTED ===', { email, password: '***' });

    // Limpar estados anteriores
    setError(null);
    setSuccess(false);

    // Validação básica (síncrona - não recarrega a página)
    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    if (!email.includes('@')) {
      setError('Por favor, insira um email válido');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    // Só ativa loading para chamadas assíncronas (API)
    setIsLoading(true);

    // Fazer login (async)
    performLogin();
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Digite seu email e senha para acessar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Erro</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-500 text-green-700 [&>svg]:text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Sucesso!</AlertTitle>
                  <AlertDescription>
                    Login realizado com sucesso. Redirecionando...
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Senha</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    onClick={(e) => e.preventDefault()}
                  >
                    Esqueceu sua senha?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Entrando...' : 'Login'}
              </Button>
            </div>

            <div className="mt-4 text-center text-sm">
              Não tem uma conta?{' '}
              <a
                href="#"
                className="underline underline-offset-4"
                onClick={(e) => e.preventDefault()}
              >
                Cadastre-se
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
