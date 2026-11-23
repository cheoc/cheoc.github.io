// Shared formatting for the 71-task NIR post.

// Every error, R² and RPD is shown with the same 3 decimals in every table
// (the first NIR post's convention). Smallest error: 0.00194 -> "0.002".
const DECIMALS = 3;

export function fmtErr(value: number): string {
  return value.toFixed(DECIMALS);
}

export function fmtR2(value: number): string {
  return value.toFixed(DECIMALS);
}

export function fmtRpd(value: number): string {
  return value.toFixed(DECIMALS);
}

// Our error relative to theirs, e.g. 0.71 -> "29% lower", 1.15 -> "15% higher".
export function fmtGap(ratio: number): string {
  const pct = Math.round(Math.abs(1 - ratio) * 100);
  if (pct === 0) {
    return 'equal';
  }
  return ratio < 1 ? `${pct}% lower` : `${pct}% higher`;
}

// NIRBENCH model ids -> names a reader knows.
const MODEL_NAMES: Record<string, string> = {
  PLSRegression: 'PLS',
  TabPFN35: 'TabPFN 3.5',
  TabICLv2: 'TabICL v2',
  IPA: 'IPA (deep learning)',
};

export function modelName(id: string): string {
  return MODEL_NAMES[id] ?? id;
}

// nirs4all task ids -> readable names: "leaf_cabo_pressed" -> "leaf cabo pressed".
export function taskName(id: string): string {
  return id.replaceAll('_', ' ');
}
