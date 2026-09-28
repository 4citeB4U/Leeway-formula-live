// LEEWAY-FORMULA-v1.0 live endpoint proof — run AFTER the Runtime Fabric control
// plane restarts with the formula module mounted.
// Probes 127.0.0.1:4001 /runtime/formula/v1/* and /runtime/health formula block.
// Exits non-zero if any proof fails. Diagnostic-origin until run through VS Code Chat.
import { pathToFileURL } from "node:url";

const BASE = process.env.LEEWAY_FABRIC_URL || "http://127.0.0.1:4001";
const FORMULA = `${BASE}/runtime/formula/v1`;

const GOLDEN_DECIMAL = [4, 50, 63, 59, 48, 69];
const GOLDEN_BASE64 = ["E", "y", "/", "7", "w", "BF"];
const GOLDEN_MATRIX = [
  [5, 9, 35, 54, 63, 7], [14, 20, 59, 60, 61, 25], [8, 30, 41, 48, 54, 4],
  [6, 17, 27, 48, 50, 5], [30, 36, 40, 42, 57, 2], [6, 26, 46, 58, 65, 25],
  [3, 4, 24, 36, 47, 17], [4, 5, 22, 50, 58, 1], [2, 9, 44, 53, 59, 8],
  [9, 14, 44, 50, 56, 3], [2, 7, 18, 29, 38, 16], [5, 25, 36, 40, 48, 3],
  [8, 10, 14, 45, 59, 5], [12, 29, 37, 43, 55, 18], [17, 44, 63, 66, 67, 4],
  [17, 38, 46, 50, 69, 20]
];

let failed = false;
const check = (name, ok, detail = "") => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  " + detail : ""}`);
  if (!ok) failed = true;
};

async function getJson(url) {
  const res = await fetch(url);
  const body = await res.json().catch(() => ({}));
  return { statusCode: res.status, body };
}

async function postJson(url, payload) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const body = await res.json().catch(() => ({}));
  return { statusCode: res.status, body };
}

const h = await getJson(`${BASE}/runtime/health`);
const formulaBlock = h.body?.formula || h.body?.components?.formula || null;
check("runtime.health.formula.status", formulaBlock?.status === "LEEWAY_FORMULA_V1_PASS", String(formulaBlock?.status));
check("runtime.health.formula.goldenVectorPass", formulaBlock?.goldenVectorPass === true, "");

const fh = await getJson(`${FORMULA}/health`);
check("formula.health.status", fh.statusCode === 200 && fh.body?.status === "LEEWAY_FORMULA_V1_PASS", String(fh.statusCode));
check("formula.health.goldenVectorPass", fh.body?.goldenVectorPass === true, "");
check("formula.health.specValid", fh.body?.specValid === true, "");
check("formula.health.adapterRegistryPass", fh.body?.adapterRegistryPass === true, "");
check("formula.health.goldenDecimal", JSON.stringify(fh.body?.expectedDecimal) === JSON.stringify(GOLDEN_DECIMAL), JSON.stringify(fh.body?.expectedDecimal));

const sp = await getJson(`${FORMULA}/spec`);
check("formula.spec.id", sp.body?.formulaId === "LEEWAY-FORMULA-v1.0", String(sp.body?.formulaId));

const ad = await getJson(`${FORMULA}/adapters`);
check("formula.adapters.raw-base64-v1", Array.isArray(ad.body?.adapters) && ad.body.adapters.some((a) => a.adapterId === "raw-base64-v1"), "");

const ev = await postJson(`${FORMULA}/evaluate`, {
  adapterId: "raw-base64-v1",
  input: { matrix: GOLDEN_MATRIX },
  caller: "live-endpoint-proof",
  traceId: `live-proof-${Date.now()}`
});
check("formula.evaluate.decimalState", ev.statusCode === 200 && JSON.stringify(ev.body?.decimalState) === JSON.stringify(GOLDEN_DECIMAL), JSON.stringify(ev.body?.decimalState));
check("formula.evaluate.base64State", JSON.stringify(ev.body?.base64State) === JSON.stringify(GOLDEN_BASE64), JSON.stringify(ev.body?.base64State));
check("formula.evaluate.resultHash", typeof ev.body?.resultHash === "string" && ev.body.resultHash.length === 64, "");

const en = await postJson(`${FORMULA}/encode`, { decimals: GOLDEN_DECIMAL });
check("formula.encode.golden", en.statusCode === 200 && JSON.stringify(en.body?.base64State) === JSON.stringify(GOLDEN_BASE64), JSON.stringify(en.body?.base64State));

const la = await getJson(`${FORMULA}/last`);
check("formula.last.resultHash", typeof la.body?.resultHash === "string" && la.body.resultHash.length === 64, "");

const rc = await getJson(`${FORMULA}/receipts`);
check("formula.receipts.list", Array.isArray(rc.body?.receipts) && rc.body.receipts.length >= 1, `count=${rc.body?.receipts?.length}`);

console.log(failed ? "\nLIVE ENDPOINT PROOF: FAIL" : "\nLIVE ENDPOINT PROOF: PASS");
process.exitCode = failed ? 1 : 0;
