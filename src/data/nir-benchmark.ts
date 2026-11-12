// NIR AutoML benchmark, results as of 12 November 2026.
// Source: reference/nir-showcase.dc.html. scripts/check-numbers.mjs diffs the
// numbers in that file against the built post, so edit both together.

export const IN_PROGRESS = 'Run in progress';

// Error values are shown with this many decimals (owner's choice), so columns
// line up. Rounding is half-up on the decimal value; the epsilon keeps binary
// floating point from turning 0.0245 into 0.024.
const ERROR_DECIMALS = 3;
const SCALE = 10 ** ERROR_DECIMALS;
const ROUNDING_EPSILON = 1e-9;
const RANGE_DASH = '–';

export function fmtError(value: string): string {
  return (Math.round(Number(value) * SCALE + ROUNDING_EPSILON) / SCALE).toFixed(ERROR_DECIMALS);
}

// "0.00538–0.00849" -> "0.005–0.008"
export function fmtRange(range: string): string {
  return range.split(RANGE_DASH).map(fmtError).join(RANGE_DASH);
}

export type Dataset = {
  name: string;
  source: string;
  samples: string;
  samplesNote?: string;
  properties: string;
  instrument: string;
  range: string;
  points: string;
  split: string;
  licence: string;
};

export const DATASETS: Dataset[] = [
  { name: 'Tecator meat', source: 'StatLib; Borggaard & Thodberg 1992', samples: '240', properties: 'fat, moisture, protein', instrument: 'Tecator Infratec food and feed analyser (transmission)', range: '850–1050 nm', points: '100 points', split: 'Yes, 172 / 43', licence: 'Public domain, with permission note' },
  { name: 'Corn', source: 'Eigenvector Research; Cargill', samples: '80', properties: 'moisture, oil, protein, starch', instrument: 'Spectrometer "m5" (one of three in the set)', range: '1100–2498 nm', points: '700 points', split: 'No', licence: 'None stated' },
  { name: 'Gasoline', source: 'R package pls; Kalivas 1997', samples: '60', properties: 'octane number', instrument: 'Not stated in our sources', range: '900–1700 nm', points: '401 points', split: 'Yes, 50 / 10', licence: 'GPL-2' },
  { name: 'NIRsoil', source: 'R package prospectr; CRA-W, Chimiométrie 2006', samples: '825', properties: 'total nitrogen, carbon, CEC', instrument: 'Not stated in our sources', range: '1100–2498 nm', points: '700 points', split: 'Yes, 618 / 207', licence: 'MIT' },
  { name: 'Fermentation', source: 'R package chemometrics; Liebmann et al. 2009', samples: '166', properties: 'glucose, ethanol', instrument: 'Brimrose Luminar 5030', range: '1115–2285 nm', points: '235 points, 1st derivative', split: 'No', licence: 'GPL 3 or later' },
  { name: 'Manure, fresh', source: 'Data INRAE; Gogé et al. 2020', samples: '332', properties: 'dry matter, ammonium N, total N', instrument: 'NIRFlex and two XDS instruments, standardised to one', range: '1100–2498 nm', points: '700 points', split: 'No', licence: 'CC0' },
  { name: 'Manure, dried', source: 'Data INRAE; Gogé et al. 2020', samples: '332', properties: 'dry matter, ammonium N, total N', instrument: 'Same samples, dried and ground', range: '1100–2498 nm', points: '700 points', split: 'No', licence: 'CC0' },
  { name: 'Barley', source: 'Zenodo, sensAIfood Grainit set 2025', samples: '86', properties: 'moisture, protein', instrument: 'AuroraNIR handheld (Grainit)', range: '950–1650 nm', points: '351 points', split: 'No', licence: 'CC BY 4.0' },
  { name: 'Corn, handheld', source: 'Zenodo, sensAIfood Grainit set 2025', samples: '187', properties: 'moisture, protein', instrument: 'AuroraNIR handheld (Grainit)', range: '950–1650 nm', points: '351 points', split: 'No', licence: 'CC BY 4.0' },
  { name: 'Wheat', source: 'Zenodo, sensAIfood Grainit set 2025', samples: '406', samplesNote: '410 in the source', properties: 'moisture, protein', instrument: 'AuroraNIR handheld (Grainit)', range: '950–1650 nm', points: '351 points', split: 'No', licence: 'CC BY 4.0' },
];

// Who has the lower error. 'equal' means within 1%.
export type Winner = 'ours' | 'pub' | 'equal';

export type Calibration = { head: string; body: string; sub: string } | null;

export type PublishedRow = {
  dataset: string;
  property: string;
  published: string;
  ours: string;
  range?: string;
  winner: Winner;
  gap: string;
  sameTestSet: boolean;
  testNote?: string;
  calibration: Calibration;
};

export const SAME_SET_NOTE =
  "Same test set as the paper. Our error and calibration: one model from the full pipeline, trained on the paper's training rows.";

export const DIFFERENT_SET_NOTE =
  'Different test procedure. Our error: mean of 3 random splits, range in brackets. Calibration: model from the full pipeline, trained on all rows (run of 12 November).';

export const PUBLISHED: PublishedRow[] = [
  { dataset: 'Tecator meat', property: 'Fat, %', published: '0.360', ours: '0.435', winner: 'pub', gap: '17% lower', sameTestSet: true, calibration: { head: 'Ensemble of 6:', body: 'TabPFN 72%, kernel ridge 22%, GPR 4%, local PLS 2%', sub: 'SG 2nd derivative; SNV + SG for TabPFN' } },
  { dataset: 'Tecator meat', property: 'Protein, %', published: '0.520', ours: '0.395', winner: 'ours', gap: '24% lower', sameTestSet: true, calibration: { head: 'Ensemble of 6:', body: 'GPR 40%, TabPFN 32%, kernel ridge 18%, local PLS 10%', sub: 'MSC + SG 2nd derivative; SNV + detrend' } },
  { dataset: 'Gasoline', property: 'Octane number', published: '0.234', ours: '0.279', winner: 'pub', gap: '16% lower', sameTestSet: true, calibration: { head: 'Ensemble of 5:', body: 'TabPFN 54%, SVR 16%, PLS 16%, ridge 14%', sub: 'SG 2nd derivative; SNV + SG 1st derivative; SG smoothing' } },
  { dataset: 'NIRsoil', property: 'Total nitrogen, g/kg', published: '0.558', ours: '0.576', winner: 'pub', gap: '3% lower', sameTestSet: true, calibration: { head: 'Ensemble of 10:', body: 'TabPFN 46%, local PLS 22%, GPR 18%, kernel ridge 10%, 2 more', sub: 'SG 1st and 2nd derivative, MSC' } },
  { dataset: 'NIRsoil', property: 'CEC, meq/100 g', published: '3.33', ours: '3.38', winner: 'pub', gap: '2% lower', sameTestSet: true, calibration: { head: 'Ensemble of 7:', body: 'TabPFN 48%, local PLS 24%, SVR 22%, 2 more', sub: 'SG 1st derivative; SNV for TabPFN' } },
  { dataset: 'NIRsoil', property: 'Carbon, %', published: '0.433', ours: '0.439', winner: 'pub', gap: '1% lower', sameTestSet: true, calibration: { head: 'Ensemble of 9:', body: 'TabPFN 22%, SVR 20%, local PLS 20%, GPR 18%, kernel ridge 14%, 2 more', sub: 'SG 1st and 2nd derivative' } },
  { dataset: 'Corn', property: 'Moisture, %', published: '0.0245', ours: '0.00735', range: '0.00538–0.00849', winner: 'ours', gap: '70% lower', sameTestSet: false, testNote: "paper's random split not published", calibration: { head: 'Single model:', body: 'PLS, 20 components', sub: 'SG smoothing' } },
  { dataset: 'Corn', property: 'Oil, %', published: '0.0388', ours: '0.0246', range: '0.0220–0.0271', winner: 'ours', gap: '37% lower', sameTestSet: false, testNote: 'same', calibration: { head: 'Single model:', body: 'PLS, 20 components', sub: 'detrend + SG 1st derivative' } },
  { dataset: 'Corn', property: 'Protein, %', published: '0.113', ours: '0.0296', range: '0.0233–0.0335', winner: 'ours', gap: '74% lower', sameTestSet: false, testNote: 'same', calibration: { head: 'Ensemble of 4:', body: 'TabPFN 82%, GPR 18%', sub: 'SG 1st and 2nd derivative' } },
  { dataset: 'Corn', property: 'Starch, %', published: '0.209', ours: '0.140', range: '0.127–0.155', winner: 'ours', gap: '33% lower', sameTestSet: false, testNote: 'same', calibration: { head: 'Ensemble of 3:', body: 'PLS 76%, TabPFN 24%', sub: 'SG 1st derivative' } },
  { dataset: 'Fermentation', property: 'Glucose, g/L', published: '4.50', ours: '3.20', range: '2.85–3.59', winner: 'ours', gap: '29% lower', sameTestSet: false, testNote: 'paper: bias-corrected SEP, repeated double cross-validation', calibration: { head: 'Ensemble of 5:', body: 'TabPFN 84%, kernel ridge 16%', sub: 'SNV + SG 1st and 2nd derivative; SG smoothing' } },
  { dataset: 'Fermentation', property: 'Ethanol, g/L', published: '1.20', ours: '0.641', range: '0.618–0.653', winner: 'ours', gap: '47% lower', sameTestSet: false, testNote: 'same', calibration: { head: 'Ensemble of 5:', body: 'TabPFN 86%, kernel ridge 6%, local PLS 4%, PLS 4%', sub: 'raw spectra and SNV + SG 1st derivative' } },
  { dataset: 'Manure, fresh', property: 'Dry matter, %', published: '1.64', ours: '2.27', range: '1.84–2.88', winner: 'pub', gap: '28% lower', sameTestSet: false, testNote: "paper's validation set not described", calibration: { head: 'Single model:', body: 'SVR', sub: 'SNV + SG 1st derivative' } },
  { dataset: 'Manure, fresh', property: 'Ammonium N, %', published: '0.0420', ours: '0.0346', range: '0.0238–0.0408', winner: 'ours', gap: '18% lower', sameTestSet: false, testNote: 'same', calibration: { head: 'Ensemble of 7:', body: 'GPR 54%, TabPFN 34%, local PLS 6%, 3 more', sub: 'SNV + detrend; SG 2nd derivative for TabPFN' } },
  { dataset: 'Manure, fresh', property: 'Total N, %', published: '0.160', ours: '0.159', range: '0.101–0.191', winner: 'equal', gap: '', sameTestSet: false, testNote: 'same', calibration: { head: 'Ensemble of 5:', body: 'TabPFN 42%, SVR 34%, local PLS 16%, kernel ridge 8%', sub: 'SNV + SG 1st and 2nd derivative; MSC' } },
];

export type OwnRow = { dataset: string; property: string; mean: string; range: string; calibration: Calibration };

export const OWN: OwnRow[] = [
  { dataset: 'Tecator meat', property: 'Moisture, %', mean: '0.622', range: '0.476–0.696', calibration: { head: 'Ensemble of 6:', body: 'TabPFN 56%, kernel ridge 32%, local PLS 8%, 2 more', sub: 'SNV + SG 2nd derivative' } },
  { dataset: 'Manure, dried', property: 'Dry matter, %', mean: '4.47', range: '4.02–4.72', calibration: { head: 'Ensemble of 8:', body: 'TabPFN 48%, kernel ridge 22%, SVR 14%, local PLS 12%, 1 more', sub: 'SG 1st derivative; SNV + SG 2nd derivative for TabPFN' } },
  { dataset: 'Manure, dried', property: 'Ammonium N, %', mean: '0.0694', range: '0.0617–0.0751', calibration: { head: 'Ensemble of 5:', body: 'LightGBM 44%, TabPFN 22%, GPR 18%, local PLS 16%', sub: 'SNV + SG 2nd derivative; SG 1st derivative' } },
  { dataset: 'Manure, dried', property: 'Total N, %', mean: '0.191', range: '0.180–0.200', calibration: { head: 'Ensemble of 8:', body: 'kernel ridge 38%, local PLS 26%, TabPFN 18%, LightGBM 12%, 2 more', sub: 'SG 1st derivative, detrend; outliers removed' } },
  { dataset: 'Barley', property: 'Moisture, %', mean: '0.566', range: '0.415–0.678', calibration: { head: 'Single model:', body: 'kernel ridge', sub: 'SG 2nd derivative' } },
  { dataset: 'Barley', property: 'Protein, %', mean: '0.467', range: '0.425–0.500', calibration: { head: 'Ensemble of 4:', body: 'TabPFN 56%, GPR 24%, PLS 20%', sub: 'SNV or MSC + SG 2nd derivative' } },
  { dataset: 'Corn, handheld', property: 'Moisture, %', mean: '0.583', range: '0.486–0.637', calibration: { head: 'Ensemble of 6:', body: 'GPR 54%, local PLS 38%, random forest 4%, 2 more', sub: 'MSC + SG 2nd derivative' } },
  { dataset: 'Corn, handheld', property: 'Protein, %', mean: '0.342', range: '0.260–0.421', calibration: { head: 'Ensemble of 7:', body: 'TabPFN 48%, PLS 22%, kernel ridge 20%, LightGBM 6%, 2 more', sub: 'MSC + SG 1st and 2nd derivative; flagged unreliable by the pipeline (slope 0.61)' } },
  { dataset: 'Wheat', property: 'Moisture, %', mean: '0.568', range: '0.266–0.742', calibration: { head: 'Single model:', body: 'SVR', sub: 'SG 2nd derivative' } },
  { dataset: 'Wheat', property: 'Protein, %', mean: '0.344', range: '0.317–0.366', calibration: { head: 'Ensemble of 7:', body: 'TabPFN 50%, kernel ridge 24%, PLS 16%, local PLS 8%, 1 more', sub: 'detrend + SG 1st derivative; SG 2nd derivative for TabPFN' } },
];

// Test settings. Each strip is 16 samples; numbers are the tested positions.
const STRIP_LENGTH = 16;

export type Strip = { cells: ('train' | 'test')[]; label?: string };

function strip(testIdx: number[], label?: string): Strip {
  const cells = Array.from({ length: STRIP_LENGTH }, (_, i) => (testIdx.includes(i) ? 'test' : 'train') as const);
  return { cells, label };
}

export type Setting = {
  title: string;
  text: string;
  scope: string;
  strips: Strip[];
  more?: string;
  alt: string;
  key?: boolean;
};

export const SETTINGS: Setting[] = [
  { title: "The paper's own split", text: 'Train and test on exactly the rows the paper used. The only like-for-like comparison.', scope: '6 properties, full pipeline', strips: [strip([12, 13, 14, 15], 'fixed')], alt: 'One fixed split: the last samples are the test set.', key: true },
  { title: '50 random splits', text: 'Shuffle which samples are tested, 50 times, with a simple model menu. Shows the range to expect.', scope: '6 properties, simple menu', strips: [strip([1, 6, 9, 14]), strip([0, 4, 11, 13]), strip([3, 7, 8, 15]), strip([2, 5, 10, 12]), strip([1, 8, 11, 14])], more: 'and 45 more', alt: 'Five example random splits with different test samples, and 45 more.' },
  { title: 'Lucky, median, unlucky', text: 'Run the full pipeline on three of those splits for soil nitrogen.', scope: 'Soil nitrogen, full pipeline', strips: [strip([2, 6, 9, 13], '0.372'), strip([0, 5, 10, 14], '0.475'), strip([3, 4, 11, 15], '0.709')], alt: 'Three splits with errors 0.372, 0.475 and 0.709.' },
  { title: 'Ensemble check', text: 'Mix the best models with the pretrained TabPFN model; keep the mix only if it beats the single best in cross-validation.', scope: 'All 25 properties, up to 3 splits', strips: [strip([1, 5, 10, 14]), strip([2, 7, 9, 12]), strip([0, 6, 11, 15])], alt: 'Three random splits per property.' },
];

// The full run: one square per property.
export const FULL_RUN = { total: 25, done: 25, running: -1 };

export const STEPS: { title: string; text: string; key?: boolean }[] = [
  { title: 'Upload', text: 'Spectra and lab reference values. Rows without a value are set aside.' },
  { title: 'Preprocess', text: '12 recipes: SNV, MSC, Savitzky-Golay derivatives and combinations.' },
  { title: 'Search models', text: 'PLS, SVR, GPR, ridge, kernel ridge, local PLS, forests, boosting, scored by cross-validation.' },
  { title: 'Check outliers', text: 'Remove outliers only if nested cross-validation says it helps.' },
  { title: 'Mix models', text: 'Best models plus TabPFN v2, kept only if cross-validation improves.', key: true },
  { title: 'Estimate error', text: 'Repeated hold-out on unseen rows, plus reliability flags.' },
  { title: 'Predict', text: 'Model stored with its software versions; predict new spectra, with a PDF report.' },
];
