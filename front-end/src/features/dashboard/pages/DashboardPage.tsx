import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { authService } from '../../auth/services/auth.service';
import {
  dashboardService,
  type DashboardMetrics,
} from '../services/dashboard.service';

export function DashboardPage() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getMetrics();
        setMetrics(data);
      } catch (err) {
        setError('Erro ao carregar métricas do dashboard');
        console.error('Error fetching metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-muted-foreground">
            Carregando métricas...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <p className="text-lg text-destructive">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <Link to="/clients">
            <Button variant="default">Clientes</Button>
          </Link>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total de Clientes</CardTitle>
            <CardDescription>
              Número total de clientes cadastrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              {metrics?.totalClients ?? 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Clientes Hoje</CardTitle>
            <CardDescription>Clientes cadastrados hoje</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              {metrics?.clientsToday ?? 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mais Visualizados</CardTitle>
            <CardDescription>Clientes mais acessados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              {metrics?.mostViewedCount ?? 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Bem-vindo!</CardTitle>
            <CardDescription>
              Este é o dashboard do sistema de gerenciamento de clientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Você está autenticado com sucesso. Use o botão "Clientes" acima
              para acessar a listagem completa e gerenciar seus clientes.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default DashboardPage;
