'use client';

import { UserInfo as UserInfoType } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import { Button } from './ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from './ui/skeleton';

interface Props {
  userInfo: UserInfoType | null;
}

export function UserInfo({ userInfo }: Props) {
  const [showIp, setShowIp] = useState(false);
  const [showAsn, setShowAsn] = useState(false);
  const [showHolder, setShowHolder] = useState(false);
  const [showGeo, setShowGeo] = useState(false);

  if (!userInfo) {
    return <Skeleton className='h-5 w-full' />;
  }

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-wrap items-center gap-x-6 gap-y-2 text-sm'>
        <div className='flex items-center gap-2 cursor-pointer' onClick={() => setShowIp(!showIp)}>
          <span className='text-muted-foreground'>IP:</span>
          <span
            className={cn('font-bold truncate max-w-xs', !showIp && 'blur-xs')}
            title={userInfo.ip}
          >
            {userInfo.ip}
          </span>
        </div>
        <div
          className='flex items-center gap-2 cursor-pointer'
          onClick={() => setShowAsn(!showAsn)}
        >
          <span className='text-muted-foreground'>ASN:</span>
          <span className={cn(!showAsn && 'blur-xs')}>AS{userInfo.asn}</span>
        </div>
        <div
          className='flex items-center gap-2 cursor-pointer'
          onClick={() => setShowHolder(!showHolder)}
        >
          <span className='text-muted-foreground'>Provider:</span>
          <span
            className={cn('truncate max-w-xs', !showHolder && 'blur-xs')}
            title={userInfo.holder}
          >
            {userInfo.holder}
          </span>
        </div>
        <div
          className='flex items-center gap-2 cursor-pointer'
          onClick={() => setShowGeo(!showGeo)}
        >
          <span className='text-muted-foreground'>Location:</span>
          <span className={cn(!showGeo && 'blur-xs')}>
            {userInfo.country}, {userInfo.city}
          </span>
        </div>
      </div>
    </div>
  );
}
