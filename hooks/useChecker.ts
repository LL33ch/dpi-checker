'use client';

import { useState, useCallback } from 'react';
import { DPIResult, ServiceResult, UserInfo } from '@/lib/types';
import { DPI_TESTS, SERVICES } from '@/lib/config';
import { checkDPI } from '@/lib/checkers/dpi';
import { checkService } from '@/lib/checkers/service';

export function useChecker() {
  const [dpiResults, setDpiResults] = useState<DPIResult[]>(() =>
    DPI_TESTS.map((test) => ({
      id: test.id,
      name: test.name,
      country: test.country,
      status: 'idle' as const,
      blocked: false,
    })),
  );

  const [serviceResults, setServiceResults] = useState<ServiceResult[]>(() =>
    SERVICES.map((service) => ({
      id: service.id,
      name: service.name,
      icon: service.icon,
      logo: service.logo,
      status: 'idle' as const,
      blocked: false,
      details: [],
    })),
  );

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const fetchUserInfo = useCallback(async () => {
    try {
      const RIPE_API = 'https://stat.ripe.net/data/';

      const ipRes = await fetch(RIPE_API + 'whats-my-ip/data.json');
      const ipData = await ipRes.json();
      const ip = ipData.data.ip;

      const asnRes = await fetch(RIPE_API + `prefix-overview/data.json?resource=${ip}`);
      const asnData = await asnRes.json();
      const asn = asnData.data.asns[0];

      const geoRes = await fetch(RIPE_API + `maxmind-geo-lite/data.json?resource=${ip}`);
      const geoData = await geoRes.json();
      const geo = geoData.data.located_resources[0]?.locations[0] || {};

      setUserInfo({
        ip,
        asn: asn.asn,
        holder: asn.holder,
        country: geo.country || 'Unknown',
        city: geo.city || 'Unknown',
      });
    } catch (error) {
      console.error('Failed to fetch user info:', error);
    }
  }, []);

  const runDPIChecks = useCallback(async () => {
    const initialResults: DPIResult[] = DPI_TESTS.map((test) => ({
      id: test.id,
      name: test.name,
      country: test.country,
      status: 'checking',
      blocked: false,
    }));

    setDpiResults(initialResults);

    DPI_TESTS.forEach(async (test) => {
      const result = await checkDPI(test);
      setDpiResults((prev) => prev.map((r) => (r.id === result.id ? result : r)));
    });

    const results = await Promise.all(DPI_TESTS.map((test) => checkDPI(test)));
    return results;
  }, []);

  const runServiceChecks = useCallback(async () => {
    const initialResults: ServiceResult[] = SERVICES.map((service) => ({
      id: service.id,
      name: service.name,
      icon: service.icon,
      logo: service.logo,
      status: 'checking',
      blocked: false,
      details: [],
    }));

    setServiceResults(initialResults);

    SERVICES.forEach(async (service) => {
      const result = await checkService(service);
      setServiceResults((prev) => prev.map((r) => (r.id === result.id ? result : r)));
    });

    const results = await Promise.all(SERVICES.map((service) => checkService(service)));
    return results;
  }, []);

  const runAllChecks = useCallback(async () => {
    setIsChecking(true);

    try {
      await Promise.all([runDPIChecks(), runServiceChecks()]);
    } finally {
      setIsChecking(false);
    }
  }, [runDPIChecks, runServiceChecks]);

  return {
    dpiResults,
    serviceResults,
    userInfo,
    isChecking,
    fetchUserInfo,
    runDPIChecks,
    runServiceChecks,
    runAllChecks,
  };
}
