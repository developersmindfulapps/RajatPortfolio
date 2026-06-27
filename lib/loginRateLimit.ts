export interface LoginRateLimiter {
  /**
   * Checks if the given IP address is currently rate-limited.
   * Returns whether it is blocked and the number of seconds remaining.
   */
  checkLimit(ip: string): Promise<{ blocked: boolean; secondsRemaining: number }>;

  /**
   * Records a failed login attempt for the given IP.
   * If failed attempts reach the threshold, blocks the IP for 15 minutes.
   */
  recordFailure(ip: string): Promise<void>;

  /**
   * Resets the failure counter for the given IP (e.g. upon successful login).
   */
  resetLimit(ip: string): Promise<void>;
}

type RateLimitRecord = {
  failures: number;
  blockedUntil: number;
};

class InMemoryLoginRateLimiter implements LoginRateLimiter {
  private store = new Map<string, RateLimitRecord>();
  private readonly MAX_FAILURES = 5;
  private readonly WINDOW_MS = 15 * 60 * 1000; // 15 minutes

  async checkLimit(ip: string): Promise<{ blocked: boolean; secondsRemaining: number }> {
    const now = Date.now();
    const record = this.store.get(ip);

    if (!record) {
      return { blocked: false, secondsRemaining: 0 };
    }

    if (record.blockedUntil > now) {
      const secondsRemaining = Math.ceil((record.blockedUntil - now) / 1000);
      return { blocked: true, secondsRemaining };
    }

    // If block expired, reset and allow
    if (record.blockedUntil > 0 && record.blockedUntil <= now) {
      this.store.delete(ip);
    }

    return { blocked: false, secondsRemaining: 0 };
  }

  async recordFailure(ip: string): Promise<void> {
    const now = Date.now();
    let record = this.store.get(ip);

    if (!record) {
      record = { failures: 1, blockedUntil: 0 };
    } else {
      record.failures += 1;
    }

    if (record.failures >= this.MAX_FAILURES) {
      record.blockedUntil = now + this.WINDOW_MS;
    }

    this.store.set(ip, record);
  }

  async resetLimit(ip: string): Promise<void> {
    this.store.delete(ip);
  }
}

// Export the singleton default instance (can be swapped in the future)
export const loginRateLimiter: LoginRateLimiter = new InMemoryLoginRateLimiter();
