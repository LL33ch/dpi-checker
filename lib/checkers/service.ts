import { Service, ServiceResult, EndpointResult } from '../types';
import { TIMEOUT_MS } from '../config';

const MAX_RETRIES = 3;

async function checkEndpointWithRetry(
  url: string,
  minSize?: number,
  expectedStatus?: number,
  retryCount = 0,
): Promise<EndpointResult> {
  try {
    return await checkEndpoint(url, minSize, expectedStatus);
  } catch (error) {
    if (retryCount < MAX_RETRIES - 1) {
      await new Promise((resolve) => setTimeout(resolve, 500 * (retryCount + 1)));
      return checkEndpointWithRetry(url, minSize, expectedStatus, retryCount + 1);
    }
    throw error;
  }
}

async function checkEndpoint(
  url: string,
  minSize?: number,
  expectedStatus?: number,
): Promise<EndpointResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const startTime = performance.now();
    const uniqueUrl = url.includes('?') ? `${url}&_t=${Date.now()}` : `${url}?_t=${Date.now()}`;

    let response: Response;
    let usedNoCors = false;

    try {
      response = await fetch(uniqueUrl, {
        signal: controller.signal,
        cache: 'no-store',
        mode: 'cors',
        credentials: 'omit',
        referrerPolicy: 'no-referrer',
      });
    } catch (corsError) {
      const error = corsError as Error;
      if (error.message?.includes('CORS') || error.message?.includes('Failed to fetch')) {
        usedNoCors = true;
        response = await fetch(uniqueUrl, {
          signal: controller.signal,
          cache: 'no-store',
          mode: 'no-cors',
          credentials: 'omit',
        });
      } else {
        throw corsError;
      }
    }

    const elapsed = performance.now() - startTime;

    if (usedNoCors) {
      clearTimeout(timeoutId);

      if (response.type === 'opaque') {
        if (expectedStatus) {
          return {
            url,
            accessible: false,
            httpStatus: 0,
            elapsed,
            error: 'Cannot verify status in no-cors mode',
          };
        }

        return {
          url,
          accessible: true,
          httpStatus: 0,
          elapsed,
          bytesReceived: undefined,
          error: undefined,
        };
      }
    }

    if (expectedStatus && response.status !== expectedStatus) {
      clearTimeout(timeoutId);
      return {
        url,
        accessible: false,
        httpStatus: response.status,
        elapsed,
        error: `Expected ${expectedStatus}, got ${response.status}`,
      };
    }

    if (!response.ok && !expectedStatus) {
      clearTimeout(timeoutId);
      return {
        url,
        accessible: false,
        httpStatus: response.status,
        elapsed,
        error: `HTTP ${response.status}`,
      };
    }

    if (minSize) {
      const reader = response.body?.getReader();
      if (!reader) {
        clearTimeout(timeoutId);
        return {
          url,
          accessible: false,
          httpStatus: response.status,
          elapsed,
          error: 'No response body',
        };
      }

      let totalBytes = 0;

      try {
        while (totalBytes < minSize) {
          const { done, value } = await reader.read();

          if (done) {
            clearTimeout(timeoutId);

            return {
              url,
              accessible: totalBytes >= minSize,
              httpStatus: response.status,
              bytesReceived: totalBytes,
              elapsed,
              error:
                totalBytes < minSize ? `Only ${totalBytes} bytes (expected ${minSize})` : undefined,
            };
          }

          totalBytes += value.byteLength;
        }

        clearTimeout(timeoutId);
        await reader.cancel();

        return {
          url,
          accessible: true,
          httpStatus: response.status,
          bytesReceived: totalBytes,
          elapsed,
        };
      } catch (readError) {
        clearTimeout(timeoutId);
        const error = readError as Error;
        return {
          url,
          accessible: false,
          httpStatus: response.status,
          bytesReceived: totalBytes,
          elapsed,
          error: `Read error: ${error.message}`,
        };
      }
    }

    clearTimeout(timeoutId);
    return {
      url,
      accessible: response.ok,
      httpStatus: response.status,
      elapsed,
    };
  } catch (err) {
    clearTimeout(timeoutId);
    const error = err as Error;

    if (error.name === 'AbortError') {
      return {
        url,
        accessible: false,
        error: 'Timeout',
      };
    }

    return {
      url,
      accessible: false,
      error: error.message || 'Unknown error',
    };
  }
}

export async function checkService(service: Service): Promise<ServiceResult> {
  const results = await Promise.all(
    service.endpoints.map((endpoint) =>
      checkEndpointWithRetry(endpoint.url, endpoint.minSize, endpoint.expectedStatus),
    ),
  );

  const accessibleCount = results.filter((r) => r.accessible).length;
  const totalCount = results.length;

  let status: ServiceResult['status'];
  let blocked: boolean;

  if (accessibleCount === 0) {
    status = 'blocked';
    blocked = true;
  } else if (accessibleCount === totalCount) {
    status = 'ok';
    blocked = false;
  } else {
    status = 'partial';
    blocked = false;
  }

  return {
    id: service.id,
    name: service.name,
    icon: service.icon,
    logo: service.logo,
    status,
    blocked,
    details: results,
  };
}
