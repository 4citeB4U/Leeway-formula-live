# USB / Device I/O — LeeWay Formula Domain

## Question

How can Formula governance improve an external-device path without pretending to alter USB signaling physics?

## Boundary

USB link rate is a physical ceiling. Formula can govern what must cross the link, when it crosses, whether verified state already exists at the destination, chunk size, retries, recovery and reconstruction.

Candidate device state:

[
D_t=[LinkReady,Queue,BytesPending,ErrorRate,DestinationState,Verification]
]

## Fold6 evidence

The mobile campaign established:

- Samsung Galaxy Z Fold6 detected through USB;
- Samsung Android ADB Interface;
- ADB 37.0.1;
- Android RSA authorization;
- phone filesystem read/write;
- host↔phone SHA equality for transformed artifacts;
- Snapdragon-native llama.cpp runtime executing on-device.

This proves a governed device path. It does **not** prove increased USB physical bandwidth.

## Reconstruction implication

Where destination already holds verified/reconstructable state:

[
BytesToTransfer\approx MissingState
]

This remains an object-specific hypothesis unless measured.

## Evidence

- experiments/mobile/GALAXY-FOLD6-GEMMA27B-PREFLIGHT-20260923.json
- experiments/mobile/FOLD6-PHONE-MEDIA-FORMULA-20260923.json
