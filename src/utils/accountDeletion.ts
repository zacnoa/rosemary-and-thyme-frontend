const GRACE_PERIOD_DAYS = 30;

/**
 * Days remaining before an account scheduled for deletion is actually purged
 * (see AccountDeletionService on the backend) - shared by
 * components/dashboard/AccountSettings.tsx's banner and
 * components/common/AccountDeletionNotice.tsx's login toast, so the two
 * always agree on the same number for the same timestamp.
 *
 * @param deletionRequestedAt `User.deletionRequestedAt`, an ISO 8601 timestamp
 * @returns whole days left, floored at 0 (never negative, even if the purge
 * job hasn't run yet the moment this ticks over)
 */
export const daysUntilAccountDeletion = (deletionRequestedAt: string): number => {
  const elapsedDays = (Date.now() - new Date(deletionRequestedAt).getTime()) / (1000 * 60 * 60 * 24);
  return Math.max(0, Math.ceil(GRACE_PERIOD_DAYS - elapsedDays));
};
