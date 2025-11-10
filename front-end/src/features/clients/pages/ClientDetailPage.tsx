import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { clientsService } from '../services/clients.service';
import { Client } from '@/shared/types/client.types';
import { centsToReal } from '@/shared/utils/currency';
import { toast } from 'sonner';
import { ArrowLeft, Pencil, Trash2, Eye } from 'lucide-react';
import { ClientModal } from '../components/ClientModal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const loadClient = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      // Usa recordView para incrementar o contador de visualizações
      const data = await clientsService.recordView(id);
      setClient(data);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao carregar cliente';
      toast.error(message);
      navigate('/clients');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadClient();
  }, [id]);

  const handleEdit = () => {
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!client) return;

    try {
      await clientsService.deleteClient(client.id);
      toast.success('Cliente excluído com sucesso!');
      navigate('/clients');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao excluir cliente';
      toast.error(message);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  if (!client) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <Link to="/clients">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para lista
          </Button>
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{client.name}</h1>
            <p className="text-muted-foreground mt-1">
              Cliente cadastrado em {formatDate(client.createdAt)}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </Button>
            <Button
              variant="destructive"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </Button>
          </div>
        </div>
      </div>

      {/* Cards de Informações */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informações Financeiras */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Financeiras</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Salário</p>
              <p className="text-2xl font-bold">{centsToReal(client.salary)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Valor da Empresa</p>
              <p className="text-2xl font-bold">
                {centsToReal(client.companyValue)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Métricas */}
        <Card>
          <CardHeader>
            <CardTitle>Métricas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Visualizações</p>
              <div className="flex items-center gap-2 mt-1">
                <Eye className="h-5 w-5 text-muted-foreground" />
                <Badge variant="secondary" className="text-lg">
                  {client.viewCount}
                </Badge>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Última atualização
              </p>
              <p className="font-medium mt-1">{formatDate(client.updatedAt)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informações do Sistema */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Informações do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">ID</p>
              <p className="font-mono text-sm mt-1">{client.id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant="outline" className="mt-1">
                {client.deletedAt ? 'Inativo' : 'Ativo'}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Criado em</p>
              <p className="text-sm mt-1">{formatDate(client.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Atualizado em</p>
              <p className="text-sm mt-1">{formatDate(client.updatedAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Edição */}
      <ClientModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        client={client}
        onSuccess={loadClient}
      />

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o cliente <strong>{client.name}</strong>?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
