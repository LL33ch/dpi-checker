'use client';

import { DPIResult } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { CircleQuestionMark, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface Props {
  results: DPIResult[];
}

export function DPIChecker({ results }: Props) {
  if (results.length === 0) return null;

  const getStatusVariant = (
    status: DPIResult['status'],
  ): 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'outline' | 'destructive' => {
    switch (status) {
      case 'idle':
        return 'secondary';
      case 'ok':
        return 'success';
      case 'blocked':
        return 'destructive';
      case 'suspicious':
        return 'warning';
      case 'checking':
        return 'outline';
      case 'error':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const getStatusText = (result: DPIResult) => {
    switch (result.status) {
      case 'idle':
        return '—';
      case 'ok':
        return 'Not detected';
      case 'blocked':
        return 'Blocked';
      case 'suspicious':
        return 'Suspicious';
      case 'checking':
        return 'Checking...';
      case 'error':
        return 'Error';
      default:
        return '—';
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>🔍 DPI Blocking (TCP 16-20)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Provider</TableHead>
                <TableHead className='text-right'>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result) => (
                <TableRow
                  key={result.id}
                  className={cn(
                    result.status == 'checking' && 'opacity-50',
                    result.status == 'blocked' && 'bg-red-500/10',
                    result.status == 'suspicious' && 'bg-yellow-500/10',
                  )}
                >
                  <TableCell>
                    <div className='flex items-center gap-2 font-medium'>
                      <Image
                        src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${result.country}.svg`}
                        width={20}
                        height={2}
                        alt={`${result.country} ${result.name}`}
                      />
                      {result.name}
                    </div>
                  </TableCell>
                  <TableCell className='text-right'>
                    <Badge variant={getStatusVariant(result.status)} appearance='ghost'>
                      {result.status == 'checking' && <Loader2 className='size-4 animate-spin' />}
                      {getStatusText(result)}
                      {result.reason && (
                        <Tooltip>
                          <TooltipTrigger>
                            <CircleQuestionMark className='size-3' />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{result.reason}</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
