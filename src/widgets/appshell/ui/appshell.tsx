'use client';
import { AppShell, Burger, Button, Container, Group, NavLink, Stack, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ChartLineIcon, ListChecksIcon, SparkleIcon, TimerIcon } from '@phosphor-icons/react';
import { LangChange } from '@widgets/lang-change';
import { GithubButton } from '@widgets/github-button';
import { useTranslations } from 'next-intl';
import { Link } from '@/src/shared/i18n/navigation';

export function AppShellMain({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();
  const t = useTranslations('AppShell');

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'md', collapsed: { desktop: true, mobile: !opened } }}
      padding='md'
    >
      <AppShell.Header>
        <Group h='100%' px='md' style={{ position: 'relative' }}>
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom='md' size='sm' />
            <Title order={4}>{t('title')}</Title>
          </Group>
          <Group
            visibleFrom='md'
            style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}
          >
            <Button variant='subtle' color='gray' href='/' component={Link}>
              {t('checker')}
            </Button>
            <Button variant='subtle' color='gray' href='/stats' component={Link}>
              {t('statistics')}
            </Button>
            <Button variant='subtle' color='gray' href='/wl-ip' component={Link}>
              {t('ipWhitelistCheck')}
            </Button>
            <Button variant='subtle' color='gray' href='/http-test' component={Link}>
              {t('httpTest')}
            </Button>
          </Group>
          <Group ms='auto'>
            <LangChange />
            <GithubButton />
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar>
        <NavLink
          href='/'
          component={Link}
          label={t('checker')}
          leftSection={<ListChecksIcon size={18} />}
          onClick={toggle}
        />
        <NavLink
          href='/stats'
          component={Link}
          label={t('statistics')}
          leftSection={<ChartLineIcon size={18} />}
          onClick={toggle}
        />
        <NavLink
          href='/wl-ip'
          label={t('ipWhitelistCheck')}
          component={Link}
          leftSection={<SparkleIcon size={18} />}
          onClick={toggle}
        />
        <NavLink
          href='/http-test'
          label={t('httpTest')}
          component={Link}
          leftSection={<TimerIcon size={18} />}
          onClick={toggle}
        />
      </AppShell.Navbar>
      <AppShell.Main>
        <Container strategy='grid' size={1000}>
          <Stack gap='md' my={20} mx={10}>
            {children}
          </Stack>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
