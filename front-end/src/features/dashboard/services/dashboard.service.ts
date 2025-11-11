import api from '@/shared/services/api';

export interface DashboardMetrics {
  totalClients: number;
  clientsToday: number;
  mostViewedCount: number;
}

export const dashboardService = {
  /**
   * Busca métricas do dashboard
   */
  async getMetrics(): Promise<DashboardMetrics> {
    const response = await api.get<DashboardMetrics>('/api/clients/metrics');
    return response.data;
  },
};
