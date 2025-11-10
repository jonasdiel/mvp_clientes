export interface Client {
  id: string;
  name: string;
  salary: number; // em centavos
  companyValue: number; // em centavos
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CreateClientDto {
  name: string;
  salary: number;
  companyValue: number;
}

export interface UpdateClientDto {
  name?: string;
  salary?: number;
  companyValue?: number;
}

export interface ClientsResponse {
  data: Client[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface QueryClientsParams {
  page?: number;
  limit?: number;
  search?: string;
  orderBy?:
    | 'name'
    | 'salary'
    | 'companyValue'
    | 'viewCount'
    | 'createdAt'
    | 'updatedAt';
  order?: 'ASC' | 'DESC';
}
