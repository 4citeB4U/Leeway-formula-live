# Storage / Media — LeeWay Formula Domain

## Exact storage equations

[
q_i=SHA256(C_i)
]

[
U(O)=\sum_i u_i|C_i|
]

[
SAF=\frac{P_{new}}{L(O)},\qquad SAFA=\frac1{SAF}
]

Exactness gate:

[
|O'|=|O|,quad SHA256(O')=SHA256(O),quad O'=O
]

## Two different scientific goals

### Exact representation
Restored bytes must equal the original.

### Behavioral/media representation
The decoded/perceived content may use a different representation, but quality/task acceptance must pass.

These claims are never mixed.

## Fold6 exact-media baseline

Real phone samples:

- camera JPEG: 0% exact reduction, SHA PASS
- screenshot JPEG: 10.39%, SHA PASS
- AAC/M4A audio: 0%, SHA PASS
- H.264/MP4 video: 0%, SHA PASS

## Image results

Raw reversible RGB temporal delta on a 16-frame 4000×3000 burst was rejected:

- native JPEG set: 22.85 MB
- exact ZIP: 2.81% reduction
- best reversible pixel-delta representation: 102.74 MB
- decoded pixels reconstructed exactly
- representation became roughly 4.5× larger

JPEG XL domain results:

- camera distance 1: 44.61% smaller, SSIM 0.9787
- camera distance 2: 73.55% smaller, SSIM 0.9404
- screenshot distance 1: 62.20% smaller, SSIM 0.9950
- screenshot distance 2: 71.66% smaller, SSIM 0.9932

## Audio results

AAC speech → Opus:

| Rate | Reduction | SDR |
|---:|---:|---:|
| 16 kb/s | 88.89% | 14.66 dB |
| 24 kb/s | 82.25% | 18.55 dB |
| 32 kb/s | 76.45% | 20.48 dB |
| 48 kb/s | 65.00% | 22.84 dB |

Two additional call recordings at 24 kb/s reduced by 82.21% and 89.09%.

Semantic/intelligibility validation remains required before original replacement.

## Video results

Initial 2048×1080 H.264 sample:

- HEVC CQ28: 40.09% smaller, SSIM 0.9895
- HEVC CQ32: 66.27% smaller, SSIM 0.9863
- AV1 CQ32: 35.01% smaller, SSIM 0.9909

Additional clips showed much lower SSIM under fixed aggressive CQ32 despite large reductions. Therefore fixed aggressive CQ was not promoted.

## Formula strategy

[
MediaType\to ContentState\to Formula\to Codec/QualityPolicy
]

not:

[
Everything\to OneCompressor
]

Original phone media remains unchanged.
