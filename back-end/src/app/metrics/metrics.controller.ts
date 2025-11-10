import { Controller, Get, Header } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MetricsService } from './metrics.service';

@ApiTags('System')
@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  @Header('Content-Type', 'text/plain')
  @ApiOperation({ summary: 'Prometheus metrics endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Metrics in Prometheus format',
    content: {
      'text/plain': {
        example: `# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",route="/api/clients",status="200"} 42

# HELP http_request_duration_seconds Duration of HTTP requests in seconds
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{le="0.1",method="GET",route="/api/clients",status="200"} 40
http_request_duration_seconds_bucket{le="0.5",method="GET",route="/api/clients",status="200"} 42
http_request_duration_seconds_sum{method="GET",route="/api/clients",status="200"} 2.5
http_request_duration_seconds_count{method="GET",route="/api/clients",status="200"} 42

# HELP clients_total Total number of clients
# TYPE clients_total counter
clients_total 100

# HELP clients_created_total Total number of clients created
# TYPE clients_created_total counter
clients_created_total 120

# HELP clients_deleted_total Total number of clients deleted
# TYPE clients_deleted_total counter
clients_deleted_total 20`,
      },
    },
  })
  async getMetrics(): Promise<string> {
    return this.metricsService.getMetrics();
  }
}
