import { DPITest, Service } from './types';

export const DPI_TESTS: DPITest[] = [
  {
    id: 'US.CF-01',
    name: 'Cloudflare #1',
    provider: 'Cloudflare',
    country: 'US',
    url: 'https://cdn.cookielaw.org/scripttemplates/202501.2.0/otBannerSdk.js',
    expectedSize: 64 * 1024,
  },
  {
    id: 'US.CF-02',
    name: 'Cloudflare #2',
    provider: 'Cloudflare',
    country: 'US',
    url: 'https://genshin.jmp.blue/characters/all',
    expectedSize: 64 * 1024,
    skipCacheBuster: true,
  },
  {
    id: 'US.CF-03',
    name: 'Cloudflare #3',
    provider: 'Cloudflare',
    country: 'US',
    url: 'https://api.frankfurter.dev/v1/2000-01-01..2002-12-31',
    expectedSize: 64 * 1024,
  },
  {
    id: 'US.DO-01',
    name: 'DigitalOcean',
    provider: 'DigitalOcean',
    country: 'US',
    url: 'https://genderize.io/',
    expectedSize: 32 * 1024,
  },
  {
    id: 'DE.HE-01',
    name: 'Hetzner',
    provider: 'Hetzner',
    country: 'DE',
    url: 'https://j.dejure.org/jcg/doctrine/doctrine_banner.webp',
    expectedSize: 64 * 1024,
  },
  {
    id: 'FI.HE-01',
    name: 'Hetzner #1',
    provider: 'Hetzner',
    country: 'FI',
    url: 'https://tcp1620-01.dubybot.live/1MB.bin',
    expectedSize: 64 * 1024,
  },
  {
    id: 'FI.HE-02',
    name: 'Hetzner #2',
    provider: 'Hetzner',
    country: 'FI',
    url: 'https://tcp1620-02.dubybot.live/1MB.bin',
    expectedSize: 64 * 1024,
  },
  {
    id: 'FI.HE-03',
    name: 'Hetzner #3',
    provider: 'Hetzner',
    country: 'FI',
    url: 'https://tcp1620-05.dubybot.live/1MB.bin',
    expectedSize: 64 * 1024,
  },
  {
    id: 'FI.HE-04',
    name: 'Hetzner #4',
    provider: 'Hetzner',
    country: 'FI',
    url: 'https://tcp1620-06.dubybot.live/1MB.bin',
    expectedSize: 64 * 1024,
  },
  {
    id: 'FR.OVH-01',
    name: 'OVH #1',
    provider: 'OVH',
    country: 'FR',
    url: 'https://eu.api.ovh.com/console/rapidoc-min.js',
    expectedSize: 64 * 1024,
  },
  {
    id: 'FR.OVH-02',
    name: 'OVH #2',
    provider: 'OVH',
    country: 'FR',
    url: 'https://ovh.sfx.ovh/10M.bin',
    expectedSize: 64 * 1024,
  },
  {
    id: 'SE.OR-01',
    name: 'Oracle',
    provider: 'Oracle',
    country: 'SE',
    url: 'https://oracle.sfx.ovh/10M.bin',
    expectedSize: 64 * 1024,
  },
  {
    id: 'DE.AWS-01',
    name: 'AWS #1',
    provider: 'AWS',
    country: 'DE',
    url: 'https://www.honda-haeusler-muenchen.de/userdata/35295/layout/fonts/proximanovaexcn-lightweb.woff',
    expectedSize: 64 * 1024,
  },
  {
    id: 'US.AWS-02',
    name: 'AWS #2',
    provider: 'AWS',
    country: 'US',
    url: 'https://corp.kaltura.com/wp-content/cache/min/1/wp-content/themes/airfleet/dist/styles/theme.css',
    expectedSize: 64 * 1024,
  },
  {
    id: 'IE.AWS-03',
    name: 'AWS #3',
    provider: 'AWS',
    country: 'IE',
    url: 'https://consent.thetimes.com/unified/wrapperMessagingWithoutDetection.js',
    expectedSize: 64 * 1024,
  },
  {
    id: 'US.GC-01',
    name: 'Google Cloud',
    provider: 'Google Cloud',
    country: 'US',
    url: 'https://api.usercentrics.eu/gvl/v3/en.json',
    expectedSize: 64 * 1024,
  },
  {
    id: 'US.FST-01',
    name: 'Fastly #1',
    provider: 'Fastly',
    country: 'US',
    url: 'https://openoffice.apache.org/images/blog/rejected.png',
    expectedSize: 64 * 1024,
  },
  {
    id: 'US.FST-02',
    name: 'Fastly #2',
    provider: 'Fastly',
    country: 'US',
    url: 'https://www.juniper.net/etc.clientlibs/juniper/clientlibs/clientlib-site/resources/fonts/lato/Lato-Regular.woff2',
    expectedSize: 64 * 1024,
  },
  {
    id: 'PL.AKM-01',
    name: 'Akamai #1',
    provider: 'Akamai',
    country: 'PL',
    url: 'https://www.lg.com/lg5-common-gp/library/jquery.min.js',
    expectedSize: 64 * 1024,
  },
  {
    id: 'PL.AKM-02',
    name: 'Akamai #2',
    provider: 'Akamai',
    country: 'PL',
    url: 'https://media-assets.stryker.com/is/image/stryker/gateway_1?$max_width_1410$',
    expectedSize: 64 * 1024,
  },
  {
    id: 'US.CDN77-01',
    name: 'CDN77',
    provider: 'CDN77',
    country: 'US',
    url: 'https://www.winkgo.com/wp-content/themes/mts_sociallyviral/fonts/fontawesome-webfont.woff2',
    expectedSize: 64 * 1024,
  },
  {
    id: 'DE.CNTB-01',
    name: 'Contabo',
    provider: 'Contabo',
    country: 'DE',
    url: 'https://cloudlets.io/wp-content/themes/Avada/includes/lib/assets/fonts/fontawesome/webfonts/fa-solid-900.woff2',
    expectedSize: 64 * 1024,
  },
];

export const SERVICES: Service[] = [
  {
    id: 'youtube',
    name: 'YouTube',
    icon: 'logos:youtube-icon',
    endpoints: [
      {
        url: 'https://rr3---sn-gvnuxaxjvh-3ggz.googlevideo.com',
        minSize: 30000,
      },
    ],
  },
  {
    id: 'twitch',
    name: 'Twitch',
    icon: 'logos:twitch',
    endpoints: [
      {
        url: 'https://static.twitchcdn.net/assets/favicon-32-e29e246c157142c94346.png',
        minSize: 1000,
      },
      {
        url: 'https://static-cdn.jtvnw.net/jtv_user_pictures/8a6381c7-d0c0-4576-b179-38bd5ce1d6af-profile_image-300x300.png',
        minSize: 5000,
      },
    ],
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: 'skill-icons:instagram',
    endpoints: [
      {
        url: 'https://www.instagram.com/static/images/ico/favicon-192.png/68d99ba29cc8.png',
        minSize: 2000,
      },
      {
        url: 'https://scontent.cdninstagram.com/v/t51.2885-19/44884218_345707102882519_2446069589734326272_n.jpg',
        minSize: 5000,
      },
    ],
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: 'logos:facebook',
    endpoints: [
      {
        url: 'https://static.xx.fbcdn.net/rsrc.php/yb/r/hLRJ1GG_y0J.ico',
        minSize: 1000,
      },
    ],
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    icon: 'fa7-brands:square-x-twitter',
    endpoints: [
      {
        url: 'https://abs.twimg.com/favicons/twitter.3.ico',
        minSize: 1000,
      },
      {
        url: 'https://abs.twimg.com/responsive-web/client-web/icon-ios.77d25eba.png',
        minSize: 2000,
      },
    ],
  },
  {
    id: 'discord',
    name: 'Discord',
    icon: 'logos:discord-icon',
    endpoints: [
      {
        url: 'https://discord.com/api/v10/gateway',
        minSize: 30,
        expectedStatus: 200,
      },
      {
        url: 'https://cdn.discordapp.com/embed/avatars/0.png',
        minSize: 500,
      },
    ],
  },
  {
    id: 'telegram',
    name: 'Telegram',
    icon: 'logos:telegram',
    endpoints: [
      {
        url: 'https://telegram.org/img/t_logo.png',
        minSize: 1000,
      },
      {
        url: 'https://web.telegram.org/a/favicon.svg',
        minSize: 500,
      },
    ],
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: 'logos:whatsapp-icon',
    endpoints: [
      {
        url: 'https://static.whatsapp.net/rsrc.php/v3/yP/r/rYZqPCBaG70.png',
        minSize: 1000,
      },
    ],
  },
  {
    id: 'rutracker',
    name: 'rutracker.org',
    logo: '/rutracker.png',
    endpoints: [
      {
        url: 'https://static.rutracker.cc/logo/logo-3.svg',
        minSize: 1000,
      },
    ],
  },
  {
    id: '7tv',
    name: '7tv.app',
    logo: '/7tv.png',
    endpoints: [
      {
        url: 'https://cdn.7tv.app/emote/01F6MQ33FG000FFJ97ZB8MWV52/1x.avif',
        minSize: 1000,
      },
    ],
  },
];

export const TIMEOUT_MS = 10000;
