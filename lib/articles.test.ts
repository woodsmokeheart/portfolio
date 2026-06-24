import {describe, it, expect} from 'vitest';
import {getArticleSlugs, getArticle, getAllArticlesMeta} from './articles';

describe('articles', () => {
  it('discovers slugs from content dir', () => {
    expect(getArticleSlugs()).toContain('kafka-testing');
  });
  it('parses bilingual frontmatter for a locale', () => {
    const a = getArticle('kafka-testing', 'en');
    expect(a?.meta.title).toBe('Testing Kafka without pain');
    expect(a?.meta.tags).toContain('kafka');
  });
  it('falls back across locales for listing', () => {
    const list = getAllArticlesMeta('ru');
    expect(list.length).toBeGreaterThan(0);
  });
});
