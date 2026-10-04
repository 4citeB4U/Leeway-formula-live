# Personal Maps Spatial Density Formula Gate

This experiment consumes real browser traces produced by LeeWay Maps with `?spatialMeasure=1`.

## Gate order

1. Capture at least three **headful, real-GPU** traces with `scripts/qa-spatial-formula-capture.mjs`.
2. Run `calibrate.mjs` on those traces. It creates a candidate range profile only.
3. Replay/ablate the same traces against the deterministic baseline.
4. Creator reviews and explicitly promotes the candidate to `PERSONAL_MAP_SPATIAL_DENSITY_ACCEPTED_CALIBRATION`.
5. Only then may `first-execution.mjs` call the canonical Formula endpoint.
6. Formula output remains EXECUTED/UNVERIFIED until the selected policy is shown to improve measured performance without reducing truth fidelity.

Historical fixtures and software-GL traces are not accepted as calibration evidence.
