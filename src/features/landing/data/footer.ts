import { IMenuItem, ISocials } from '../types';

export const footerDetails: {
  subheading: string;
  quickLinks: IMenuItem[];
  email: string;
  telephone: string;
  socials: ISocials;
} = {
  subheading:
    'Lucent is a Pomodoro timer app that helps you stay focused and productive.',
  quickLinks: [
    {
      text: 'Features',
      url: '#features'
    },
    {
      text: 'Pricing',
      url: '#pricing'
    },
    {
      text: 'Policy',
      url: '/policy'
    }
  ],
  email: 'kanent.tech@gmail.com',
  telephone: '',
  socials: {
    github: 'https://github.com',
    // x: 'https://twitter.com/x',
    twitter: 'https://twitter.com/Twitter',
    facebook: 'https://facebook.com',
    // youtube: 'https://youtube.com',
    linkedin: 'https://www.linkedin.com',
    // threads: 'https://www.threads.net',
    instagram: 'https://www.instagram.com'
  }
};
