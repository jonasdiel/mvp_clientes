import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { clientSchema, ClientFormData } from '../schemas/client.schema';
import { Client } from '@/shared/types/client.types';
import { centsToDecimal, decimalToCents } from '@/shared/utils/currency';

interface ClientFormProps {
  defaultValues?: Client;
  onSubmit: (data: ClientFormData) => void | Promise<void>;
  isLoading?: boolean;
  submitLabel?: string;
}

export function ClientForm({
  defaultValues,
  onSubmit,
  isLoading = false,
  submitLabel = 'Salvar',
}: ClientFormProps) {
  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: defaultValues
      ? {
          name: defaultValues.name,
          salary: centsToDecimal(defaultValues.salary),
          companyValue: centsToDecimal(defaultValues.companyValue),
        }
      : {
          name: '',
          salary: 0,
          companyValue: 0,
        },
  });

  const handleSubmit = async (data: ClientFormData) => {
    // Converte os valores de volta para centavos antes de enviar
    const formattedData: ClientFormData = {
      ...data,
      salary: decimalToCents(data.salary),
      companyValue: decimalToCents(data.companyValue),
    };
    await onSubmit(formattedData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input
                  placeholder="Digite o nome do cliente"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="salary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Salário (R$)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseFloat(e.target.value) || 0)
                  }
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="companyValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor da Empresa (R$)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseFloat(e.target.value) || 0)
                  }
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Salvando...' : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
