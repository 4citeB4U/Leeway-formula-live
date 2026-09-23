# Compute & Hardware Equation Families

## I — Inference / Compute

### I-01 Raw telemetry adapter
**Status:** CERTIFIED INFERENCE ADAPTER RULE

[
\rho_{s,j}=clamp\left(\frac{raw_{s,j}}{scale_{s,j}},0,1\right)
]

### I-02 Controller snapshot

[
H_s(t)=[q_1,q_2,q_3,q_4,q_5,q_6]
]

### I-03 Controller history

[
X_t(s)=[H_s(t-15),\ldots,H_s(t)]\in\{0,\ldots,69\}^{16\times6}
]

### I-04 Shared-kernel controller

[
I_s(t)=LW-F1(X_t(s))
]

### I-05 Controller set

[
I_r(t)=\{I_P,I_M,I_K,I_Q,I_I,I_D\}
]

### I-06 Forbidden average
**Status:** CERTIFIED ARCHITECTURE

[
I_r(t)\ne\frac{I_P+I_M+I_K+I_Q+I_I+I_D}{6}
]

A critical bottleneck must not be hidden by averaging all controllers.

### I-07 Prompt/prefill state

[
H_P=[tokens,compute,io,ttft,batch,interference]
]

### I-08 Memory-movement state

[
H_M=[hbmRead,hbmWrite,hostCopy,stall,footprint,bytesPerToken]
]

### I-09 KV-cache state

[
H_K=[capacity,growth,fragmentation,eviction,miss,allocation]
]

### I-10 Scheduling state

[
H_Q=[depth,wait,arrivalService,hol,batch,slo]
]

### I-11 Interconnect state

[
H_I=[bandwidth,collective,syncWait,straggler,bytes,topology]
]

### I-12 Decode state

[
H_D=[tpot,bandwidth,bytesPerToken,kvRead,batch,overhead]
]

### I-13 Determinism guarantee

[
SameInput+SameFormula+SameArithmeticContract\Rightarrow SameSerializedOutput
]

---

## H — Hardware

### H-01 Node state

[
H_n(t)=[CPU_n,RAM_n,Disk_n,Network_n,Process_n,Queue_n]
]

### H-02 Quantized node

[
Q_n(t)=[Q_{69}(CPU),Q_{69}(RAM),Q_{69}(Disk),Q_{69}(Network),Q_{69}(Process),Q_{69}(Queue)]
]

### H-03 Node history

[
W_n(t)=[Q_n(t-15),\ldots,Q_n(t)]
]

### H-04 Hardware pattern formula

[
LW-H1(n,t)=LW-F1(W_n(t))
]

### H-05 Placement vector

[
\Phi_{PLACE}(w,n)=[q_{CPUHeadroom},q_{RAMHeadroom},q_{NetworkHeadroom},q_{DiskHeadroom},q_{Reliability},q_{Locality},-q_{Queue},-ID(n)]
]

### H-06 Placement winner

[
n^*=LexArgMax_n\Phi_{PLACE}(w,n)
]

### H-07 Global node state

[
GlobalState=\{NodeState_1,\ldots,NodeState_N\}
]

### H-08 LW-H2 closure state
**Status:** OPEN FORMULA SLOT

Resource-allocation role is defined historically; an independent closed kernel has not been recovered.

### H-09 LW-H4 closure state
**Status:** OPEN FORMULA SLOT

Pressure/recovery role is defined historically; an independent closed kernel has not been recovered.
