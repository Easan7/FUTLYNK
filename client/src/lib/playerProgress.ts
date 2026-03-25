export const PLAYER_PROGRESS_KEY = "futlynk_player_progress";

export type PlayerProgress = {
  points: number;
  gamesLogged: number;
  rewardedGameIds: string[];
  redeemedVoucherIds: string[];
};

const DEFAULT_PROGRESS: PlayerProgress = {
  points: 120,
  gamesLogged: 0,
  rewardedGameIds: [],
  redeemedVoucherIds: [],
};

export function loadPlayerProgress(): PlayerProgress {
  if (typeof window === "undefined") return DEFAULT_PROGRESS;

  const raw = window.localStorage.getItem(PLAYER_PROGRESS_KEY);
  if (!raw) return DEFAULT_PROGRESS;

  try {
    const parsed = JSON.parse(raw) as Partial<PlayerProgress>;
    return {
      points: parsed.points ?? DEFAULT_PROGRESS.points,
      gamesLogged: parsed.gamesLogged ?? DEFAULT_PROGRESS.gamesLogged,
      rewardedGameIds: parsed.rewardedGameIds ?? DEFAULT_PROGRESS.rewardedGameIds,
      redeemedVoucherIds: parsed.redeemedVoucherIds ?? DEFAULT_PROGRESS.redeemedVoucherIds,
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function savePlayerProgress(progress: PlayerProgress) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PLAYER_PROGRESS_KEY, JSON.stringify(progress));
}

export function awardGameCompletion(gameId: string, points = 50) {
  const progress = loadPlayerProgress();

  if (progress.rewardedGameIds.includes(gameId)) {
    return { awarded: false, progress };
  }

  const next: PlayerProgress = {
    ...progress,
    points: progress.points + points,
    gamesLogged: progress.gamesLogged + 1,
    rewardedGameIds: [...progress.rewardedGameIds, gameId],
  };

  savePlayerProgress(next);
  return { awarded: true, progress: next };
}

export function redeemVoucher(voucherId: string, cost: number) {
  const progress = loadPlayerProgress();

  if (progress.redeemedVoucherIds.includes(voucherId)) {
    return { ok: false, reason: "already-redeemed" as const, progress };
  }

  if (progress.points < cost) {
    return { ok: false, reason: "insufficient-points" as const, progress };
  }

  const next: PlayerProgress = {
    ...progress,
    points: progress.points - cost,
    redeemedVoucherIds: [...progress.redeemedVoucherIds, voucherId],
  };

  savePlayerProgress(next);
  return { ok: true, reason: null, progress: next };
}
