import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ClientForm } from './ClientForm';
import { Client } from '@/shared/types/client.types';
import { ClientFormData } from '../schemas/client.schema';
import { clientsService } from '../services/clients.service';
import { toast } from 'sonner';

interface ClientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client?: Client | null;
  onSuccess?: () => void;
}

export function ClientModal({
  open,
  onOpenChange,
  client,
  onSuccess,
}: ClientModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!client;

  const handleSubmit = async (data: ClientFormData) => {
    try {
      setIsLoading(true);

      if (isEditing) {
        await clientsService.updateClient(client.id, data);
        toast.success('Cliente atualizado com sucesso!');
      } else {
        await clientsService.createClient(data);
        toast.success('Cliente criado com sucesso!');
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao salvar cliente';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Cliente' : 'Novo Cliente'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Atualize as informações do cliente'
              : 'Preencha os dados para criar um novo cliente'}
          </DialogDescription>
        </DialogHeader>
        <ClientForm
          defaultValues={client || undefined}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          submitLabel={isEditing ? 'Atualizar' : 'Criar'}
        />
      </DialogContent>
    </Dialog>
  );
}
