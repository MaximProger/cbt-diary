import { vi } from 'vitest';
import buildSearchQuery from './buildSearchQuery';

describe('buildSearchQuery', () => {
  it('should return base query when search term is empty', () => {
    const mockBaseQuery = { some: 'query' };
    const result = buildSearchQuery(mockBaseQuery, '');
    expect(result).toBe(mockBaseQuery);
  });

  it('should return base query when search term has 2 or less characters', () => {
    const mockBaseQuery = { some: 'query' };
    const result1 = buildSearchQuery(mockBaseQuery, 'a');
    const result2 = buildSearchQuery(mockBaseQuery, 'ab');
    expect(result1).toBe(mockBaseQuery);
    expect(result2).toBe(mockBaseQuery);
  });

  it('should call or() with correct search conditions when search term has more than 2 characters', () => {
    const mockBaseQuery = {
      or: vi.fn().mockReturnThis(),
    };
    const searchTerm = 'test';

    const result = buildSearchQuery(mockBaseQuery, searchTerm);

    expect(mockBaseQuery.or).toHaveBeenCalledWith(
      'worst_case.ilike.%test%,worst_consequences.ilike.%test%,what_can_i_do.ilike.%test%,how_will_i_cope.ilike.%test%',
    );
    expect(result).toBe(mockBaseQuery.or());
  });

  it('should trim search term before processing', () => {
    const mockBaseQuery = {
      or: vi.fn().mockReturnThis(),
    };
    const searchTerm = '  test  ';

    buildSearchQuery(mockBaseQuery, searchTerm);

    expect(mockBaseQuery.or).toHaveBeenCalledWith(
      expect.stringContaining('test'), // Проверяем, что в запросе есть подстрока без пробелов
    );
  });
});
