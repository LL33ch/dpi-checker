export interface DPITest {
  id: string;
  name: string;
  provider: string;
  country: string;
  url: string;
  expectedSize: number;
  skipCacheBuster?: boolean;
}

export interface DPIResult {
  id: string;
  name: string;
  country: string;
  status: 'idle' | 'checking' | 'ok' | 'blocked' | 'suspicious' | 'error';
  blocked: boolean;
  totalBytes?: number;
  chunks?: number[];
  elapsed?: number;
  httpStatus?: number;
  error?: string;
  reason?: string;
}

export interface ServiceEndpoint {
  url: string;
  minSize?: number;
  expectedStatus?: number;
}

export interface Service {
  id: string;
  name: string;
  icon?: string;
  logo?: string;
  endpoints: ServiceEndpoint[];
}

export interface ServiceResult {
  id: string;
  name: string;
  icon?: string;
  logo?: string;
  status: 'idle' | 'checking' | 'ok' | 'blocked' | 'partial' | 'error';
  blocked: boolean;
  details: EndpointResult[];
}

export interface EndpointResult {
  url: string;
  accessible: boolean;
  httpStatus?: number;
  bytesReceived?: number;
  error?: string;
  elapsed?: number;
}

export interface UserInfo {
  ip: string;
  asn: number;
  holder: string;
  country: string;
  city: string;
}
