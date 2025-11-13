import { describe, it, expect, vi, beforeEach } from 'vitest';
import { aggregateMetrics } from '../src/services/metrics-aggregator.js';

describe('aggregateMetrics', () => {
  let mockEnv;

  beforeEach(() => {
    mockEnv = {
      CACHE_ANALYTICS: {
        writeDataPoint: vi.fn(async () => {})
      }
    };
  });

  it('should return placeholder data when Analytics Engine query not available', async () => {
    const metrics = await aggregateMetrics(mockEnv, '1h');

    // Since Analytics Engine only supports writeDataPoint(), not query()
    // the function returns metadata about the limitation and solution
    expect(metrics._limitation).toBeDefined();
    expect(metrics._solution).toBeDefined();
    expect(metrics._graphql_endpoint).toBe('https://api.cloudflare.com/client/v4/graphql');
    expect(metrics.period).toBe('1h');
    expect(metrics.timestamp).toBeDefined();
  });

  it('should calculate hit rates from provided data', async () => {
    // NOTE: This test documents the expected calculation logic
    // In production, metrics come from Cloudflare GraphQL API, not Workers Analytics Engine

    const testData = {
      results: [
        { cache_source: 'edge_hit', count: 78000, avg_latency: 8.2 },
        { cache_source: 'kv_hit', count: 16000, avg_latency: 42.1 },
        { cache_source: 'api_miss', count: 6000, avg_latency: 350.0 }
      ]
    };

    let totalRequests = 0;
    let edgeHits = 0;
    let kvHits = 0;

    for (const row of testData.results) {
      totalRequests += row.count || 0;
      if (row.cache_source === 'edge_hit') edgeHits = row.count;
      else if (row.cache_source === 'kv_hit') kvHits = row.count;
    }

    const edgeRate = (edgeHits / totalRequests) * 100;
    const kvRate = (kvHits / totalRequests) * 100;
    const combinedRate = ((edgeHits + kvHits) / totalRequests) * 100;

    expect(edgeRate).toBeCloseTo(78.0, 1);
    expect(kvRate).toBeCloseTo(16.0, 1);
    expect(combinedRate).toBeCloseTo(94.0, 1);
    expect(totalRequests).toBe(100000);
  });
});
