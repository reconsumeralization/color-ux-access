export class RateLimiter {
  private currentRequests: number = 0;
  
  constructor(private maxConcurrent: number) {}

  async acquire(): Promise<void> {
    while (this.currentRequests >= this.maxConcurrent) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    this.currentRequests++;
  }

  release(): void {
    this.currentRequests = Math.max(0, this.currentRequests - 1);
  }
} 