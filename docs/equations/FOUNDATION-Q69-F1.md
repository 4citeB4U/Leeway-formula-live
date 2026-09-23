# S Equation Family

**Recovered objects:** 15

> Status/source labels preserved from LeeWay Formula Mathematical Engineering Textbook v2. Open/gap equations remain non-canonical.

## S-01 — Normalized state
**Status:** LEEWAY STATE PRIMITIVE  
**Source:** LeeWay Formula corpus

$$
\rho=\mathcal N(z)\in[0,1]
$$

## S-02 — Q69 normalized quantizer
**Status:** CANONICAL / CERTIFIED  
**Source:** LeeWay Formula corpus

$$
Q_{69}(\rho)=\operatorname{clamp}(\operatorname{round}(69\rho),0,69)
$$

## S-03 — Q69 bounded raw form
**Status:** LEEWAY STATE PRIMITIVE  
**Source:** LeeWay Formula corpus

$$
Q_{69}(z)=\operatorname{clamp}\!\left(\operatorname{round}\!\left(\frac{69(z-L)}{U-L}\right),0,69\right)
$$

## S-04 — Executable Q69
**Status:** CERTIFIED IMPLEMENTATION  
**Source:** Inference arithmetic contract

$$
q69FromPressure(\rho)=\min(69,\max(0,\operatorname{round}(69\rho)))
$$

## S-05 — Quantization reconstruction
**Status:** LEEWAY STATE PRIMITIVE  
**Source:** LeeWay Formula corpus

$$
\hat\rho=\frac{q}{69}
$$

## S-06 — Quantization error
**Status:** DERIVED BOUND  
**Source:** LeeWay Formula corpus

$$
\epsilon_q=\left|\rho-\frac{Q_{69}(\rho)}{69}\right|\le\frac1{138}
$$

## S-07 — Midpoint condition
**Status:** BOUNDARY CONDITION  
**Source:** LeeWay Formula corpus

$$
69\rho=n+\frac12
$$

## S-08 — Canonical Base64 alphabet
**Status:** CANONICAL REPRESENTATION  
**Source:** LeeWay Formula corpus

$$
A\!:\!Z\leftrightarrow0\!:\!25,\ a\!:\!z\leftrightarrow26\!:\!51,\ 0\!:\!9\leftrightarrow52\!:\!61,\ +\leftrightarrow62,\ /\leftrightarrow63
$$

## S-09 — Extended QB64 states
**Status:** LEEWAY EXTENSION  
**Source:** LeeWay Formula corpus

$$
64\to BA,\ 65\to BB,\ 66\to BC,\ 67\to BD,\ 68\to BE,\ 69\to BF
$$

## S-10 — Fixed-width QB64
**Status:** CERTIFIED IMPLEMENTATION  
**Source:** LEEWAY-INFERENCE-FAMILY-v1.0

$$
QB64(q)=encode(q).padStart(2,\texttt{A})
$$

## S-11 — Six-bit domain
**Status:** EXTERNAL / BASIC MATH  
**Source:** Binary arithmetic

$$
2^6=64,\qquad \{0,\ldots,63\}\leftrightarrow\{000000,\ldots,111111\}
$$

## S-12 — Binary expansion
**Status:** EXTERNAL / BASIC MATH  
**Source:** Binary arithmetic

$$
q=\sum_{k=0}^{5}b_k2^k,\qquad b_k\in\{0,1\}
$$

## S-13 — Round trip
**Status:** CERTIFIED INVARIANT  
**Source:** LeeWay inference codec

$$
q=Q_{69}(\rho),\ s=QB64(q),\ q'=decodeQb64(s)\Rightarrow q'=q
$$

## S-14 — Six-value state row
**Status:** CANONICAL INPUT PRIMITIVE  
**Source:** LeeWay Formula corpus

$$
\mathbf q_t=[q_{t,1},\ldots,q_{t,6}],\qquad q_{t,j}\in\{0,\ldots,69\}
$$

## S-15 — 16×6 history
**Status:** CANONICAL INPUT CONTRACT  
**Source:** LeeWay Formula runtime

$$
W_t\in\mathbb Z^{16\times6},\qquad 0\le W_{ij}\le69
$$

---

# F1 Equation Family

**Recovered objects:** 21

## F1-01 — Candidate universe
**Status:** CANONICAL F1

$$
\Omega=\{0,1,\ldots,69\}
$$

## F1-02 — Golden input cardinality
**Status:** GOLDEN-VECTOR FACT

$$
16\times6=96
$$

## F1-03 — Golden mean
**Status:** GOLDEN-VECTOR FACT

$$
\mu=\frac{2908}{96}=\frac{727}{24}
$$

## F1-04 — Frequency

$$
F(x)=\#\{(r,c):X_{r,c}=x\}
$$

## F1-05 — Gap

$$
G(x)=\begin{cases}16-\ell(x),&F(x)>0\\16,&F(x)=0\end{cases}
$$

## F1-06 — Recency

$$
R(x)=\begin{cases}\ell(x)/16,&F(x)>0\\0,&F(x)=0\end{cases}
$$

## F1-07 — Prevalence

$$
P(x)=\frac{F(x)}{16}
$$

## F1-08 — Recurrence velocity

$$
v(x)=\begin{cases}o_n-o_{n-1},&n\ge2\\0,&n<2\end{cases}
$$

## F1-09 — Recurrence acceleration

$$
a(x)=\begin{cases}(o_n-o_{n-1})-(o_{n-1}-o_{n-2}),&n\ge3\\0,&n<3\end{cases}
$$

## F1-10 — Displacement

$$
D(x)=|x-\mu|
$$

## F1-11 — Hamiltonian-like energy

$$
H(x)=\frac12\left(v(x)^2+D(x)^2\right)
$$

## F1-12 — Co-occurrence

$$
C(x)=\sum_{r:x\in X_r}\bigl(|distinct(X_r)|-1\bigr)
$$

## F1-13 — Historical tenth feature
**Status:** HISTORICAL EXECUTABLE

$$
W(x)=v(x)+a(x)+G(x)+D(x)+R(x)
$$

## F1-14 — Historical feature vector

$$
\Phi(x)=[F,G,R,P,v,a,D,H,C,W]
$$

## F1-15 — Per-feature min-max normalization

$$
Norm_\Omega(z_x)=\begin{cases}\dfrac{z_x-z_{min}}{z_{max}-z_{min}},&z_{max}\ne z_{min}\\0,&z_{max}=z_{min}\end{cases}
$$

## F1-16 — Exact composite score

$$
S_t(x)=\frac1{10}\sum_{k=1}^{10}Norm_\Omega(\Phi_{t,k}(x))
$$

## F1-17 — Softmax relative strength

$$
p_t(x)=\frac{e^{S_t(x)}}{\sum_{y\in\Omega}e^{S_t(y)}}
$$

## F1-18 — Exact ranking equivalence

$$
S(x)>S(y)\Longleftrightarrow e^{S(x)}>e^{S(y)}
$$

## F1-19 — Historical exact tie order

$$
Order(x)=(-S(x),-F(x),-R(x),x)
$$

## F1-20 — F1 result

$$
LW-F1(X_t)=\{(x,B64(x))\mid x\in Top_6^\downarrow\{p_t(x):x\in\Omega\}\}
$$

## F1-21 — Frozen golden output

$$
[4,50,63,59,48,69]\quad\leftrightarrow\quad[E,y,/,7,w,BF]
$$
