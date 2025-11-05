import { IFAQ } from '../types';
import { siteDetails } from './site-details';

export const faqs: IFAQ[] = [
  {
    question: `What is ${siteDetails.siteName}?`,
    answer: `${siteDetails.siteName} is a mindful Pomodoro app designed to help you focus, stay balanced, and build consistent productivity habits through structured work and break sessions.`
  },
  {
    question: `Can I use ${siteDetails.siteName} across multiple devices?`,
    answer: `Yes! Your ${siteDetails.siteName} account syncs seamlessly across all your devices — keeping your focus sessions, statistics, and progress perfectly aligned.`
  },
  {
    question: `Does ${siteDetails.siteName} work offline?`,
    answer: `Absolutely. You can start and complete your focus sessions even without an internet connection. Once you're back online, all your data will automatically sync.`
  },
  {
    question: 'Can I customize my focus sessions?',
    answer:
      'Of course! You can adjust session duration, break times, and even create custom modes like Study, Work, or Meditation to fit your daily routine.'
  },
  {
    question: 'Does Lucent integrate with Apple Health?',
    answer:
      'Yes. When enabled, your focus time will be logged as Mindful Minutes in Apple Health — helping you track your mental wellness alongside productivity.'
  },
  {
    question: 'Is my data secure?',
    answer:
      'Absolutely. Your information is stored securely with end-to-end encryption. Lucent never shares or sells your personal data.'
  },
  {
    question: 'What if I need help or have feedback?',
    answer:
      'Our support team is always here to help via in-app feedback or email. You can also explore our quick-start guide and community tips directly within the app.'
  }
];
