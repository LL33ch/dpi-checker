import { DPITest, DPIResult } from '../types';
import { TIMEOUT_MS } from '../config';

export async function checkDPI(test: DPITest): Promise<DPIResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  const result: DPIResult = {
    id: test.id,
    name: test.name,
    country: test.country,
    status: 'checking',
    blocked: false,
  };

  try {
    const startTime = performance.now();

    const url = test.skipCacheBuster
      ? test.url
      : test.url.includes('?')
        ? `${test.url}&t=${Math.random()}`
        : `${test.url}?t=${Math.random()}`;

    const response = await fetch(url, {
      signal: controller.signal,
      cache: 'no-store',
      mode: 'cors',
      credentials: 'omit',
    });

    result.httpStatus = response.status;

    if (!response.ok && response.status >= 400) {
      clearTimeout(timeoutId);
      return {
        ...result,
        status: 'error',
        blocked: false,
        error: `HTTP ${response.status}`,
      };
    }

    const reader = response.body?.getReader();
    if (!reader) {
      clearTimeout(timeoutId);
      return {
        ...result,
        status: 'error',
        blocked: false,
        error: 'No response body',
      };
    }

    let totalBytes = 0;
    const chunks: number[] = [];

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        clearTimeout(timeoutId);
        const elapsed = performance.now() - startTime;

        if (totalBytes < test.expectedSize) {
          return {
            ...result,
            status: 'suspicious',
            blocked: false,
            totalBytes,
            chunks,
            elapsed,
            reason: 'Stream ended with insufficient data',
          };
        }

        return {
          ...result,
          status: 'ok',
          blocked: false,
          totalBytes,
          chunks,
          elapsed,
        };
      }

      totalBytes += value.byteLength;
      chunks.push(value.byteLength);

      if (totalBytes >= test.expectedSize) {
        clearTimeout(timeoutId);
        await reader.cancel();

        return {
          ...result,
          status: 'ok',
          blocked: false,
          totalBytes,
          chunks,
          elapsed: performance.now() - startTime,
        };
      }
    }
  } catch (err) {
    clearTimeout(timeoutId);
    const error = err as Error;

    if (error.name === 'AbortError') {
      return {
        ...result,
        status: 'blocked',
        blocked: true,
        reason: result.httpStatus
          ? 'Connection interrupted after receiving data (TCP 16-20 block)'
          : 'Connection timeout (possible network block)',
        error: 'Timeout',
      };
    }

    return {
      ...result,
      status: 'error',
      blocked: false,
      error: error.message || 'Unknown error',
    };
  }
}
