export function paginate<T>(
  data: T[],
  page: number,
  limit: number,
): { data: T[]; total: number; page: number; limit: number } {
  if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
    throw new Error('Invalid pagination parameters');
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  return {
    data: data.slice(startIndex, endIndex),
    total: data.length,
    page,
    limit,
  };
}
