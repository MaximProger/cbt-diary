// eslint-disable-next-line @typescript-eslint/no-explicit-any
const buildSearchQuery = (baseQuery: any, searchTerm: string) => {
  const trimmedTerm = searchTerm.trim();

  if (trimmedTerm.length <= 2) {
    return baseQuery;
  }

  return baseQuery.or(
    `worst_case.ilike.%${trimmedTerm}%,worst_consequences.ilike.%${trimmedTerm}%,what_can_i_do.ilike.%${trimmedTerm}%,how_will_i_cope.ilike.%${trimmedTerm}%`,
  );
};

export default buildSearchQuery;
