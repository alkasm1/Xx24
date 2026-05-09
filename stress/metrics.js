// /stress/metrics.js
export class Metrics {
  constructor() {
    this.okCount = 0;
    this.errCount = 0;
    this.latencies = [];
  }

  ok(latency = 0) {
    this.okCount++;
    this.latencies.push(latency);
  }

  err() {
    this.errCount++;
  }

  percentile(p) {
    if (this.latencies.length === 0) return 0;
    const sorted = [...this.latencies].sort((a, b) => a - b);
    const idx = Math.floor((p / 100) * sorted.length);
    return sorted[idx] || 0;
  }

  finalize() {
    return {
      ok: this.okCount,
      errors: this.errCount,
      p50: this.percentile(50),
      p90: this.percentile(90),
      p99: this.percentile(99),
      total: this.okCount + this.errCount
    };
  }
}
