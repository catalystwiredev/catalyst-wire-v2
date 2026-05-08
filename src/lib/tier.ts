/**
 * Centralized tier-gating utility.
 *
 * Catalyst Wire monetizes via three tiers stored in `Users.user_plan`:
 *   "free"          — public marketing visitors and unauthenticated users
 *   "alpha"         — paid: full data + live AI signal stream + charts
 *   "institutional" — paid: everything in alpha + future webhook feed,
 *                     priority support, white-label exports
 *
 * Every page/component reads tier through `effectiveTier()` instead of
 * `session.user.plan` directly. While `OPEN_ALL_FEATURES === true`, the
 * resolver returns "institutional" regardless of the actual session plan —
 * letting us build and verify every feature end-to-end before applying
 * restrictions in one centralized flip.
 *
 * To lock down: set `OPEN_ALL_FEATURES = false` (or wire to an env var).
 * Restrictions automatically engage everywhere because every check goes
 * through this utility.
 */

import type { Session } from "next-auth";

export type Tier = "free" | "alpha" | "institutional";

const TIER_RANK: Record<Tier, number> = {
  free:          0,
  alpha:         1,
  institutional: 2,
};

/**
 * If true, every authenticated session resolves as "institutional" tier.
 * Flip to `false` (or replace with an env-var read) when ready to lock down.
 */
export const OPEN_ALL_FEATURES = true;

/**
 * Resolve the effective tier for a session.
 * - Unauthenticated → "free"
 * - OPEN_ALL_FEATURES on + authenticated → "institutional"
 * - Otherwise → whatever Stripe/DB says the user's `plan` is
 */
export function effectiveTier(session: Session | null | undefined): Tier {
  if (!session?.user) return "free";
  if (OPEN_ALL_FEATURES) return "institutional";

  const raw = (session.user as { plan?: string }).plan ?? "free";
  if (raw === "alpha" || raw === "institutional") return raw;
  return "free";
}

/** True if the session is at or above the given tier. */
export function tierAtLeast(session: Session | null | undefined, min: Tier): boolean {
  return TIER_RANK[effectiveTier(session)] >= TIER_RANK[min];
}

/** Convenience: any paid tier (alpha or institutional). */
export function isPremium(session: Session | null | undefined): boolean {
  return tierAtLeast(session, "alpha");
}

/** Should the upgrade CTAs be visible? Hide them when features are open. */
export function shouldShowUpgradeCTA(session: Session | null | undefined): boolean {
  if (OPEN_ALL_FEATURES) return false;
  return !isPremium(session);
}
