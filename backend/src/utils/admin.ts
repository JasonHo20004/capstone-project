export const calculateAverageRating = (
  ratings: { score: number }[]
): number => {
  if (ratings.length === 0) {
    return 0;
  }
  const sum = ratings.reduce((acc, rating) => acc + rating.score, 0);
  return Number((sum / ratings.length).toFixed(2));
};