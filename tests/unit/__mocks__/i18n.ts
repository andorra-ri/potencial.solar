import { createI18n } from 'vue-i18n';

export const getI18n = (messages: Record<string, any>) => {
  const i18n = createI18n({
    allowComposition: true,
    locale: 'ca',
    messages: { ca: messages },
  });
  return i18n;
};
