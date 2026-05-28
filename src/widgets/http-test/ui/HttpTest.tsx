'use client';

import { useCallback, useRef, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Group,
  NumberInput,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { AreaChart } from '@mantine/charts';
import { useTranslations } from 'next-intl';

interface RequestResult {
  n: number;
  ms: number | null;
}

const TIMEOUT_MS = 1000;

async function makeRequest(url: string): Promise<number | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const start = performance.now();
  try {
    await fetch(`${url}${url.includes('?') ? '&' : '?'}_=${Math.random()}`, {
      cache: 'no-store',
      signal: controller.signal,
    });
    return Math.round(performance.now() - start);
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export function HttpTest() {
  const t = useTranslations('HttpTest');
  const [url, setUrl] = useState('https://1.1.1.1/cdn-cgi/trace');
  const [count, setCount] = useState<number>(100);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<RequestResult[]>([]);
  const [successes, setSuccesses] = useState(0);
  const [failures, setFailures] = useState(0);
  const stopRef = useRef(false);

  const run = useCallback(async () => {
    setRunning(true);
    setResults([]);
    setSuccesses(0);
    setFailures(0);
    stopRef.current = false;

    let ok = 0;
    let fail = 0;

    for (let i = 1; i <= count; i++) {
      if (stopRef.current) break;
      const ms = await makeRequest(url);
      if (ms === null) fail++;
      else ok++;
      setSuccesses(ok);
      setFailures(fail);
      setResults((prev) => [...prev, { n: i, ms }]);
    }

    setRunning(false);
  }, [url, count]);

  const stop = useCallback(() => {
    stopRef.current = true;
  }, []);

  const done = results.filter((r) => r.ms !== null);
  const avgMs =
    done.length > 0 ? Math.round(done.reduce((s, r) => s + r.ms!, 0) / done.length) : null;
  const minMs = done.length > 0 ? Math.min(...done.map((r) => r.ms!)) : null;
  const maxMs = done.length > 0 ? Math.max(...done.map((r) => r.ms!)) : null;

  const chartData = results.map((r) => ({ n: r.n, ms: r.ms ?? undefined }));

  return (
    <Stack>
      <TextInput
        label={t('targetUrl')}
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        disabled={running}
      />
      <NumberInput
        label={t('requestCount')}
        value={count}
        onChange={(v) => setCount(Number(v))}
        min={1}
        max={1000}
        disabled={running}
      />
      <Group>
        <Button onClick={run} disabled={running} loading={running && results.length === 0}>
          {t('runTest')}
        </Button>
        {running && (
          <Button variant='light' color='red' onClick={stop}>
            {t('stop')}
          </Button>
        )}
      </Group>

      {results.length > 0 && (
        <>
          <SimpleGrid cols={{ base: 2, xs: 5 }} spacing='sm'>
            <StatBadge label={t('success')} value={successes} color='green' />
            <StatBadge label={t('failures')} value={failures} color='red' />
            <StatBadge label={t('avg')} value={avgMs !== null ? `${avgMs} ms` : '—'} color='blue' />
            <StatBadge label={t('min')} value={minMs !== null ? `${minMs} ms` : '—'} color='teal' />
            <StatBadge
              label={t('max')}
              value={maxMs !== null ? `${maxMs} ms` : '—'}
              color='orange'
            />
          </SimpleGrid>

          <Card p='xs'>
            <AreaChart
              h={200}
              data={chartData}
              dataKey='n'
              series={[{ name: 'ms', color: 'blue', label: t('responseTime') }]}
              connectNulls={false}
              withDots={false}
              curveType='monotone'
            />
          </Card>
        </>
      )}
    </Stack>
  );
}

function StatBadge({
  label,
  value,
  color,
}: {
  label: string;
  value: number | string;
  color: string;
}) {
  return (
    <Card withBorder p='xs'>
      <Text size='xs' c='dimmed' mb={2}>
        {label}
      </Text>
      <Badge color={color} variant='light' size='lg' radius='sm'>
        {value}
      </Badge>
    </Card>
  );
}
