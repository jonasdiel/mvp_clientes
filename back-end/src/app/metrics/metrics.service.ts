import { Injectable } from '@nestjs/common';
import { Counter, Histogram, Registry, register } from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly registry: Registry;

  // HTTP metrics
  public readonly httpRequestsTotal: Counter;
  public readonly httpRequestDuration: Histogram;

  // Clients metrics
  public readonly clientsTotal: Counter;
  public readonly clientsCreatedTotal: Counter;
  public readonly clientsDeletedTotal: Counter;

  constructor() {
    this.registry = register;

    // HTTP Metrics
    this.httpRequestsTotal = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status'],
      registers: [this.registry],
    });

    this.httpRequestDuration = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status'],
      buckets: [0.1, 0.5, 1, 2, 5],
      registers: [this.registry],
    });

    // Clients Metrics
    this.clientsTotal = new Counter({
      name: 'clients_total',
      help: 'Total number of clients',
      registers: [this.registry],
    });

    this.clientsCreatedTotal = new Counter({
      name: 'clients_created_total',
      help: 'Total number of clients created',
      registers: [this.registry],
    });

    this.clientsDeletedTotal = new Counter({
      name: 'clients_deleted_total',
      help: 'Total number of clients deleted',
      registers: [this.registry],
    });
  }

  getMetrics(): Promise<string> {
    return this.registry.metrics();
  }

  getContentType(): string {
    return this.registry.contentType;
  }

  // Helper methods
  incrementClientsCreated() {
    this.clientsCreatedTotal.inc();
  }

  incrementClientsDeleted() {
    this.clientsDeletedTotal.inc();
  }

  setClientsTotal(count: number) {
    // Reset and set the counter to the current count
    this.clientsTotal.reset();
    this.clientsTotal.inc(count);
  }

  recordHttpRequest(method: string, route: string, status: number, duration: number) {
    this.httpRequestsTotal.labels(method, route, status.toString()).inc();
    this.httpRequestDuration.labels(method, route, status.toString()).observe(duration);
  }
}
