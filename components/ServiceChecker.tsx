'use client';

import { ServiceResult } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Check, X, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '@iconify/react';
import Image from 'next/image';

interface Props {
  results: ServiceResult[];
}

export function ServiceChecker({ results }: Props) {
  const [selectedService, setSelectedService] = useState<ServiceResult | null>(null);

  const isIOS =
    typeof navigator !== 'undefined' && /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());

  if (results.length === 0) return null;

  const getStatusBgClass = (status: ServiceResult['status']) => {
    switch (status) {
      case 'ok':
        return 'bg-green-100 dark:bg-green-950 border-green-300 dark:border-green-800 hover:bg-green-200 dark:hover:bg-green-900';
      case 'blocked':
        return 'bg-red-100 dark:bg-red-950 border-red-300 dark:border-red-800 hover:bg-red-200 dark:hover:bg-red-900';
      case 'partial':
        return 'bg-yellow-100 dark:bg-yellow-950 border-yellow-300 dark:border-yellow-800 hover:bg-yellow-200 dark:hover:bg-yellow-900';
      case 'checking':
        return 'bg-muted border-border animate-pulse';
      case 'error':
        return 'bg-muted border-border hover:bg-accent';
      default:
        return 'bg-muted border-border hover:bg-accent';
    }
  };

  const getStatusText = (result: ServiceResult) => {
    const accessible = result.details.filter((d) => d.accessible).length;
    const total = result.details.length;

    switch (result.status) {
      case 'ok':
        return '✅ Available';
      case 'blocked':
        return '❌ Blocked';
      case 'partial':
        return `⚠️ Partial (${accessible}/${total})`;
      case 'checking':
        return '⏳ Checking...';
      case 'error':
        return '⚠️ Error';
      default:
        return '—';
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <>
      <div className='space-y-4'>
        <Card>
          <CardHeader>
            <CardTitle>🌐 Service Check</CardTitle>
          </CardHeader>
          <CardContent>
            {isIOS && (
              <div className='mb-4 flex items-start gap-2 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900 p-3 text-sm'>
                <AlertTriangle className='h-4 w-4 text-yellow-600 dark:text-yellow-500 mt-0.5 shrink-0' />
                <div className='text-yellow-800 dark:text-yellow-200'>
                  <strong>iOS device:</strong> Due to Safari security restrictions, service check results may be inaccurate.
                </div>
              </div>
            )}
            <div className='grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 gap-3'>
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => setSelectedService(result)}
                  className={cn(
                    'flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all cursor-pointer aspect-square',
                    getStatusBgClass(result.status),
                  )}
                  title={result.name}
                >
                  {result.icon && <Icon icon={result.icon} className='size-10' />}
                  {result.logo && (
                    <Image src={result.logo} width={40} height={40} alt={result.name} />
                  )}

                  <span className='text-[10px] font-medium text-center line-clamp-1 mt-2'>
                    {result.name}
                  </span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!selectedService} onOpenChange={() => setSelectedService(null)}>
        <DialogContent className='w-full overflow-y-auto'>
          {selectedService && (
            <>
              <DialogHeader>
                <DialogTitle className='flex items-center gap-2'>
                  {selectedService.icon && <Icon icon={selectedService.icon} className='size-10' />}
                  {selectedService.logo && (
                    <Image
                      src={selectedService.logo}
                      width={40}
                      height={40}
                      alt={selectedService.name}
                    />
                  )}
                  <span>{selectedService.name}</span>
                </DialogTitle>
                <DialogDescription>{getStatusText(selectedService)}</DialogDescription>
              </DialogHeader>

              <div className='space-y-3 mt-4'>
                <div className='flex items-center justify-between text-sm'>
                  <span className='font-semibold'>Check details:</span>
                  <span className='text-muted-foreground'>
                    {selectedService.details.filter((d) => d.accessible).length}/
                    {selectedService.details.length} OK
                  </span>
                </div>

                <div className='space-y-2'>
                  {selectedService.details.map((detail, idx) => (
                    <Card key={idx} className='bg-muted/50 py-4'>
                      <CardContent className='px-4'>
                        <div className='flex items-start gap-2'>
                          {detail.accessible ? (
                            <Check className='h-4 w-4 text-green-600 dark:text-green-500 mt-0.5 shrink-0' />
                          ) : (
                            <X className='h-4 w-4 text-destructive mt-0.5 shrink-0' />
                          )}
                          <div className='flex-1 min-w-0 text-xs overflow-hidden'>
                            <div className='font-medium break-all line-clamp-1'>
                              {new URL(detail.url).hostname}
                            </div>
                            <div className='text-muted-foreground text-[10px] break-all line-clamp-2'>
                              {new URL(detail.url).pathname}
                            </div>

                            {detail.httpStatus !== undefined && (
                              <div className='text-muted-foreground mt-1'>
                                HTTP {detail.httpStatus}
                              </div>
                            )}

                            {detail.bytesReceived !== undefined && (
                              <div className='mt-1'>
                                📦 {formatBytes(detail.bytesReceived)}
                                {detail.elapsed && ` • ⏱️ ${detail.elapsed.toFixed(0)}ms`}
                              </div>
                            )}

                            {detail.error && (
                              <div className='text-destructive mt-1 text-[10px] break-all'>
                                ⚠️ {detail.error}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
