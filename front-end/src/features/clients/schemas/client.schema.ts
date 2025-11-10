import { z } from 'zod';

export const clientSchema = z.object({
  name: z
    .string()
    .min(1, 'O nome é obrigatório')
    .max(255, 'O nome deve ter no máximo 255 caracteres'),
  salary: z
    .number({
      required_error: 'O salário é obrigatório',
      invalid_type_error: 'O salário deve ser um número',
    })
    .min(0, 'O salário deve ser maior ou igual a zero'),
  companyValue: z
    .number({
      required_error: 'O valor da empresa é obrigatório',
      invalid_type_error: 'O valor da empresa deve ser um número',
    })
    .min(0, 'O valor da empresa deve ser maior ou igual a zero'),
});

export type ClientFormData = z.infer<typeof clientSchema>;
