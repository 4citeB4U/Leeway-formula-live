# LeeWay Formula Mathematics

This chapter is the mathematical topography. The street-level equation map is [EQUATION-ATLAS.md](EQUATION-ATLAS.md).

## State language

[
\rho=\mathcal N(z)\in[0,1]
]

[
\boxed{Q_{69}(\rho)=\operatorname{clamp}(\operatorname{round}(69\rho),0,69)}
]

[
Q_{69}(z)=\operatorname{clamp}\left(\operatorname{round}\left(\frac{69(z-L)}{U-L}\right),0,69\right)
]

[
\hat\rho=\frac q{69}
]

[
\epsilon_q=\left|\rho-\frac{Q_{69}(\rho)}{69}\right|\le\frac1{138}
]

## QB64 / binary identity

[
64\to BA, 65\to BB, 66\to BC, 67\to BD, 68\to BE, 69\to BF
]

[
\mathbf q_t=[q_{t,1},\ldots,q_{t,6}]
]

[
\boxed{W_t\in\mathbb Z^{16\times6}},\quad 0\le W_{ij}\le69
]

## Golden historical kernel

[
\Omega=\{0,1,\ldots,69\}
]

[
16\times6=96
]

[
\mu=\frac{2908}{96}=\frac{727}{24}
]

[
F(x)=\#\{(r,c):X_{r,c}=x\}
]

[
G(x)=\begin{cases}16-\ell(x),&F(x)>0\\16,&F(x)=0\end{cases}
]

[
R(x)=\begin{cases}\ell(x)/16,&F(x)>0\\0,&F(x)=0\end{cases}
]

[
P(x)=\frac{F(x)}{16}
]

[
v(x)=\begin{cases}o_n-o_{n-1},&n\ge2\\0,&n<2\end{cases}
]

[
a(x)=\begin{cases}(o_n-o_{n-1})-(o_{n-1}-o_{n-2}),&n\ge3\\0,&n<3\end{cases}
]

[
D(x)=|x-\mu|
]

[
H(x)=\frac12(v(x)^2+D(x)^2)
]

[
C(x)=\sum_{r:x\in X_r}(|distinct(X_r)|-1)
]

Historical tenth feature:

[
W(x)=v(x)+a(x)+G(x)+D(x)+R(x)
]

[
\Phi(x)=[F,G,R,P,v,a,D,H,C,W]
]

Recovered material also uses Q and phi notation in later records; this repository preserves the notation/version conflict rather than silently equating them.

## Ranking

[
Norm_\Omega(z_x)=\begin{cases}\frac{z_x-z_{min}}{z_{max}-z_{min}},&z_{max}\ne z_{min}\\0,&z_{max}=z_{min}\end{cases}
]

[
S_t(x)=\frac1{10}\sum_{k=1}^{10}Norm_\Omega(\Phi_{t,k}(x))
]

[
p_t(x)=\frac{e^{S_t(x)}}{\sum_{y\in\Omega}e^{S_t(y)}}
]

[
S(x)>S(y)\Longleftrightarrow e^{S(x)}>e^{S(y)}
]

[
Order(x)=(-S(x),-F(x),-R(x),x)
]

[
\boxed{[4,50,63,59,48,69]\leftrightarrow[E,y,/,7,w,BF]}
]

## Governance, routing, proof, recovery

[
g(a)=\prod_{i=1}^{m}c_i(a),\quad c_i\in\{0,1\}
]

[
q_G(a)=69g(a)
]

[
R_{LW}(a)=Lex[q_{Fit},q_V,q_R,q_A,-q_L,-q_C,-q_{Load},-ID(a)]
]

[
a^*=LexArgMax_{a\in\Omega_{eligible}}R_{LW}(a)
]

[
V_G=\prod_i e_i
]

[
V_S=\frac{\sum_i w_iq_i}{\sum_iw_i}
]

The all-zero-weight denominator remains an explicit audit gap.

[
f^*=LexArgMax_f\Phi_{REC}(f)
]

## Resources

[
D=\sum_jd_j
]

[
b_i=\left\lfloor B\frac{d_i}{\sum_jd_j}\right\rfloor
]

Resource-indexed conservation repair:

[
\sum_i b_{i,r}+R_r=B_r
]

[
D_r=0\Rightarrow b_{i,r}=0,\quad R_r=B_r
]

## Hardware family

[
H_n(t)=[CPU,RAM,Disk,Network,Process,Queue]
]

[
Q_n(t)=[Q_{69}(CPU),Q_{69}(RAM),Q_{69}(Disk),Q_{69}(Network),Q_{69}(Process),Q_{69}(Queue)]
]

[
W_n(t)=[Q_n(t-15),\ldots,Q_n(t)]
]

[
\boxed{LW-H1(n,t)=LW-F1(W_n(t))}
]

[
\Phi_{PLACE}(w,n)=[q_{CPUHeadroom},q_{RAMHeadroom},q_{NetworkHeadroom},q_{DiskHeadroom},q_{Reliability},q_{Locality},-q_{Queue},-ID(n)]
]

## Storage / reconstruction family

[
q_i=SHA256(C_i)
]

[
U(O)=\sum_i u_i|C_i|
]

[
O=R+\Delta
]

[
Reconstruct(R,\Delta)=O
]

[
SAF=\frac{P_{new}}{L(O)},\qquad SAFA=\frac1{SAF}
]

[
H(U\mid O,K)=0
]

[
|O'|=|O|,\quad SHA256(O')=SHA256(O),\quad O'=O
]

## Unified architecture

[
LW-F_n:M\to Q_{69}\to QB64\to Binary\to State\to F_n(State)
]

[
Standards\to Harness\to Formula\to Worker\to Execution\to Test\to Veritas\to Receipt\to LearningLedger\to UpdatedState
]

[
F4\to F5\to Repair\to F4
]

Status must travel with every equation: canonical, proven, candidate, external, historical, or open gap.
