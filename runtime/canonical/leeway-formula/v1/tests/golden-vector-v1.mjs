import { evaluate, verifyGolden, GOLDEN_MATRIX, GOLDEN_DECIMAL, GOLDEN_BASE64 } from '../leeway-formula-v1.mjs';

let failed = false;
const check = (name, ok, detail) => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`);
  if (!ok) failed = true;
};

const golden = verifyGolden();
check('goldenVectorPass', golden.goldenVectorPass, JSON.stringify(golden.computedDecimal));

const result = evaluate(GOLDEN_MATRIX);
check('decimalState', JSON.stringify(result.decimalState) === JSON.stringify(GOLDEN_DECIMAL), `got [${result.decimalState}]`);
check('base64State', JSON.stringify(result.base64State) === JSON.stringify(GOLDEN_BASE64), `got [${result.base64State}]`);
check('top10Length', result.top10.length === 10, `got ${result.top10.length}`);
check('inputHashStable', result.inputHash === golden.inputHash || golden.inputHash === null, result.inputHash);
check('resultHashPresent', typeof result.resultHash === 'string' && result.resultHash.length === 64, '');

console.log(failed ? '\nGOLDEN VECTOR TEST: FAIL' : '\nGOLDEN VECTOR TEST: PASS');
process.exit(failed ? 1 : 0);
