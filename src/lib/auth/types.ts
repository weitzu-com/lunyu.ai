import type { GameProgress } from "@/lib/game-progress";

export type AccountUser = { id: string; email: string; name: string; emailVerified: boolean };
export type CloudGameSave = { progress: GameProgress; revision: number; updatedAt: string };
export type AccountSession = {
  configured: boolean;
  registrationAvailable: boolean;
  registrationMessage: string;
  user: AccountUser | null;
  capabilities: { emailVerification: boolean; passwordRecovery: boolean; cloudProgress: boolean };
};
