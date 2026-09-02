const GRACE_PERIOD_DAYS = 30;

/**
 * Provides the daysUntilAccountDeletion function.
 */
export const daysUntilAccountDeletion = (deletionRequestedAt: string): number => {
  const elapsedDays = (Date.now() - new Date(deletionRequestedAt).getTime()) / (1000 * 60 * 60 * 24);
  return Math.max(0, Math.ceil(GRACE_PERIOD_DAYS - elapsedDays));
};
