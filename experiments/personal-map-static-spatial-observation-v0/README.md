# Personal Map Static-Spatial Observation v0

This is a separate measurement and calibration lane from `personal-map-spatial-density-v0`.

It measures static map presentation pressure only:

1. visible static candidate count
2. rendered static label count
3. enabled static layer count
4. camera height
5. frame time
6. interaction latency

Dynamic motion count and transit route deviation are intentionally excluded.

Calibration requires at least three 16-row live traces, at least two device profiles, and street/neighborhood/city viewport regimes. Static and dynamic calibration ranges must never be pooled.

Formula execution remains NOT_EXECUTED until the static calibration candidate is separately reviewed, ablated, and promoted.
