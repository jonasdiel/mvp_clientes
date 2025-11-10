import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MetricsService } from '../../metrics/metrics.service';

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  constructor(private readonly metricsService: MetricsService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();

    // Capture the response
    res.on('finish', () => {
      const duration = (Date.now() - startTime) / 1000; // Convert to seconds
      const route = req.route?.path || req.path;
      const method = req.method;
      const status = res.statusCode;

      // Record metrics
      this.metricsService.recordHttpRequest(method, route, status, duration);
    });

    next();
  }
}
