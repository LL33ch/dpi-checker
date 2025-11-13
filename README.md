# 🔍 DPI-CHECKER

Web application for detecting DPI (Deep Packet Inspection) blocking and checking the availability of popular services.

## Description

DPI-CHECKER is a tool for diagnosing internet censorship and blocking.

### Detection Method

DPI blocking is detected using the **TCP 16-20** method: when downloading a 64KB file, it analyzes whether the full data volume was downloaded. If less than the expected size is downloaded (but more than 16-20 KB), this indicates possible DPI system interference, which terminates the connection after analyzing the beginning of the transmission.

More about the method: [github.com/net4people/bbs/issues/490](https://github.com/net4people/bbs/issues/490)

## Configuration

### Adding DPI Tests

Edit `lib/config.ts`:

```typescript
export const DPI_TESTS: DPITest[] = [
  {
    id: 'unique-id',
    name: '🇺🇸 Provider Name',
    provider: 'Provider',
    country: '🇺🇸',
    url: 'https://example.com/file.bin',
    expectedSize: 64 * 1024, // 64 KB
  },
  // ...
];
```

### Adding Services

Edit `lib/config.ts`:

```typescript
export const SERVICES: Service[] = [
  {
    id: 'service-id',
    name: 'Service Name',
    icon: 'mdi:service-icon', // Iconify icon
    urls: ['https://example.com/resource'],
    // Optional:
    expectedStatus: 200, // Expected HTTP status
    minBytes: 1024, // Minimum response size
  },
  // ...
];
```

Based on the project [hyperion-cs/dpi-checkers](https://github.com/hyperion-cs/dpi-checkers)
