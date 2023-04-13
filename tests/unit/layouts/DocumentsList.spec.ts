import { describe, beforeEach, it } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/vue';
import { getI18n } from '../__mocks__';
import { DocumentsList } from '/@/layouts';

const i18n = getI18n({ project: { docs: 'Documents de Referència' } });

const docs = [
  { name: 'Document 1', type: 'link', link: 'https://www.doc1.com' },
  { name: 'Document 2', type: 'file', link: 'https://www.doc2.com' },
  { name: 'Document 3', type: 'link', link: 'https://www.doc3.com' },
];

describe('DocumentsList layout', () => {
  beforeEach(() => {
    render(DocumentsList, {
      global: { plugins: [i18n] },
      props: { docs },
    });
  });

  it('should mount component', () => {
    screen.getByText('Documents de Referència');
  });

  it('should render document links list', () => {
    const links = screen.getAllByText(/Document \d/);
    expect(links).toHaveLength(3);
  });

  it('should render document link', () => {
    const link = screen.getByText('Document 1') as HTMLAnchorElement;
    expect(link.href).toBe('https://www.doc1.com/');
    expect(link.textContent?.trim()).toBe('Document 1');
  });

  it.skip('should render document image', () => {
    const image = screen.getByAltText('Document 1') as HTMLImageElement;
    expect(image.src.endsWith('/doc-link.svg')).toBeTruthy();
  });
});
