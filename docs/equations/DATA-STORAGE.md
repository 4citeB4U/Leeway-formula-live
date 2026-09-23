# Database, Temporal Memory & Storage Equation Families

## D — Database / Temporal Memory

### D-01 Directional traversal model

[
T_d(D)=\alpha_d+N_d(D)C_d
]

### D-02 Update count

[
N_d(D)\approx\left\lceil\frac{D}{q_d}\right\rceil
]

### D-03 Expanded cost

[
T_d(D)\approx\alpha_d+\left\lceil\frac{D}{q_d}\right\rceil(\tau_d+r_d+s_d)
]

### D-04 Asymmetry ratio

[
A(D)=\frac{T_{\downarrow}(D)}{T_{\uparrow}(D)}
]

### D-05 Reverse coordinate

[
U=2^{64}-1,\qquad r(s)=U-s
]

### D-06 Order reversal

[
s_1<s_2\Rightarrow r(s_1)>r(s_2)
]

### D-07 Directional query cost

[
C_d(Q)=C_{seek}+P_dC_{page}+M_dC_{miss}+X_dC_{frontier}+V_dC_{version}
]

### D-08 Best direction

[
d^*=\operatorname*{arg\,min}_d C_d(Q)
]

### D-09 Best reconstruction checkpoint

[
j^*=\operatorname*{arg\,min}_j[C_{load}(C_j)+D(C_j,S_t)C_\Delta+X_jC_{frontier}]
]

### D-10 Composite temporal key

[
K=EntityID\parallel ReverseSequence\parallel TieBreaker
]

---

## ST — Storage / Representation

### ST-01 Logical object

[
O=(b_1,\ldots,b_N),\qquad L(O)=N
]

### ST-02 Content segmentation

[
\mathcal C(O)=\{C_1,\ldots,C_m\},\qquad\sum_i|C_i|=N
]

### ST-03 FastCDC Gear hash
**Status:** EXTERNAL STORAGE RESEARCH

[
fp_i=(fp_{i-1}\ll1)+Gear[b_i]
]

### ST-04 FastCDC cut
**Status:** EXTERNAL STORAGE RESEARCH

[
fp_i\land Mask=0
]

### ST-05 Exact state identity

[
q_i=SHA256(C_i)
]

### ST-06 Known-state set

[
\mathcal K=\{q:\text{state already verified}\}
]

### ST-07 New-state indicator

[
u_i=\begin{cases}0,&q_i\in\mathcal K\\1,&q_i\notin\mathcal K\end{cases}
]

### ST-08 Unique-byte demand

[
U(O)=\sum_i u_i|C_i|
]

### ST-09 Container invariant signature
**Status:** EXTERNAL STORAGE RESEARCH

[
\sigma_j=(L_j,H_j)
]

### ST-10 Derivable representation

[
O=R+\Delta
]

### ST-11 Exact derivability

[
Reconstruct(R,\Delta)=O
]

### ST-12 Delta compression
**Status:** EXTERNAL STORAGE RESEARCH

[
D=C(B\oplus N)
]

### ST-13 Delta reconstruction
**Status:** EXTERNAL STORAGE RESEARCH

[
N=B\oplus C^{-1}(D)
]

### ST-14 Association confidence
**Status:** EXTERNAL ASSOCIATION MATH

[
A(X,Y)=\frac{P(XY)}{P(X)}
]

### ST-15 Model-free projection
**Status:** EXTERNAL COMPRESSION RESEARCH

[
x=Hs
]

### ST-16 Code rate
**Status:** EXTERNAL COMPRESSION MATH

[
r=\frac{k}{n}<1
]

### ST-17 Source Acquisition Factor

[
SAF=\frac{P_{new}}{L(O)}
]

### ST-18 Acquisition amplification

[
SAFA=\frac1{SAF}=\frac{L(O)}{P_{new}}
]

### ST-19 Reconstruction Sufficiency Point

[
H(U\mid O,K)=0
]

### ST-20 Length exactness

[
|O'|=|O|
]

### ST-21 Hash exactness

[
SHA256(O')=SHA256(O)
]

### ST-22 Byte exactness

[
O'=O\quad\text{byte-for-byte}
]

### ST-23 Pipeline ceiling

[
Q_{Supreme}\le\min(Q_{IO},Q_{CDC},Q_{ID},Q_{\Delta},Q_{RLS},Q_{Verify})
]

### ST-24 Golden physical gain

[
Gain=Free_{after}-Free_{before}
]

### ST-25 10× tier

[
SAFA\ge10\Longleftrightarrow SAF\le0.1
]

### ST-26 100× tier

[
SAFA\ge100\Longleftrightarrow SAF\le0.01
]

### ST-27 300× tier

[
SAFA\ge300\Longleftrightarrow SAF\le0.003333\ldots
]

### ST-28 1000× target
**Status:** TARGET — NOT FORCED RESULT

[
SAFA\ge1000\Longleftrightarrow SAF\le0.001
]
