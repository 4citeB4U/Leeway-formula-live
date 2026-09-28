import { evaluate, GOLDEN_MATRIX } from '../leeway-formula-v1.mjs';
import { encode, decode, encodeVector, decodeVector } from '../base64-codec.mjs';

let failed = false;
const check = (name, ok, detail) => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`);
  if (!ok) failed = true;
};

const run1 = evaluate(GOLDEN_MATRIX);
const run2 = evaluate(GOLDEN_MATRIX);
check('reproducibleResultHash', run1.resultHash === run2.resultHash, run1.resultHash);
check('reproducibleDecimalState', JSON.stringify(run1.decimalState) === JSON.stringify(run2.decimalState), '');

let roundTrip = true;
for (let x = 0; x < 70; x++) {
  if (decode(encode(x)) !== x) roundTrip = false;
}
check('codecRoundTrip0to69', roundTrip, '');

const goldenPairs = [[4, 'E'], [50, 'y'], [63, '/'], [59, '7'], [48, 'w'], [69, 'BF'], [64, 'BA'], [65, 'BB'], [66, 'BC'], [67, 'BD'], [68, 'BE']];
let pairsOk = true;
for (const [d, b] of goldenPairs) {
  if (encode(d) !== b) pairsOk = false;
}
check('codecGoldenPairs', pairsOk, '');

const perturbed = GOLDEN_MATRIX.map((row, r) => row.map((v, c) => (r === 15 && c === 5 ? (v === 20 ? 21 : 20) : v)));
const perturbedRun = evaluate(perturbed);
check('perturbedInputHashDiffers', perturbedRun.inputHash !== run1.inputHash, '');
check('perturbedResultHashDiffers', perturbedRun.resultHash !== run1.resultHash, '');

check('vectorCodecRoundTrip', JSON.stringify(decodeVector(encodeVector([0, 1, 63, 64, 69]))) === JSON.stringify([0, 1, 63, 64, 69]), '');

console.log(failed ? '\nREPRODUCIBILITY TEST: FAIL' : '\nREPRODUCIBILITY TEST: PASS');
process.exit(failed ? 1 : 0);
