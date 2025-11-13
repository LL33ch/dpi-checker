'use client';

import { useEffect, useState } from 'react';
import { useChecker } from '@/hooks/useChecker';
import { UserInfo } from '@/components/UserInfo';
import { DPIChecker } from '@/components/DPIChecker';
import { ServiceChecker } from '@/components/ServiceChecker';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import GitHubButton from 'react-github-btn';

export default function Home() {
  const { dpiResults, serviceResults, userInfo, isChecking, fetchUserInfo, runAllChecks } =
    useChecker();

  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

  return (
    <main className='min-h-screen p-4 md:p-8'>
      <div className='max-w-[1400px] mx-auto space-y-4'>
        <div className='flex items-center justify-between'>
          <h1 className='text-xl font-bold mb-2'>🔍 DPI-CHECKER</h1>
          <GitHubButton
            href='https://github.com/LL33ch/dpi-checker'
            data-color-scheme='no-preference: light; light: light; dark: dark;'
            data-size='large'
            data-show-count='true'
            aria-label='Star LL33ch/dpi-checker on GitHub'
          >
            Star
          </GitHubButton>
        </div>

        <UserInfo userInfo={userInfo} />

        <div>
          <Button onClick={runAllChecks} disabled={isChecking} size='lg' className='w-full'>
            {isChecking ? (
              <>
                <Loader2 className='h-5 w-5 animate-spin' />
                Checking...
              </>
            ) : (
              'Start Check'
            )}
          </Button>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
          <DPIChecker results={dpiResults} />
          <ServiceChecker results={serviceResults} />
        </div>
      </div>
    </main>
  );
}
