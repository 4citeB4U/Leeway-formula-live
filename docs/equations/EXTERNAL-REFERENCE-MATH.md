# External / Reference Mathematics

These equations are preserved because they informed LeeWay engineering, but **they are not claimed as LeeWay inventions**. Attribution matters.

## Signal / observation

### X-01 Sampled observation
[
x_i[n]=Q\left(v_i\left(\frac{n}{f_s}\right)\right)
]

### X-02 Digital filter
[
y_i[n]=\sum_{m=0}^{M}b_mx_i[n-m]-\sum_{m=1}^{P}a_my_i[n-m]
]

### X-03 Threshold event
[
s_i[n]=\mathbb1\{y_i[n]<\tau_i\}
]

### X-04 Binned count
[
n_i[k]=\sum_{n\in\mathcal B_k}s_i[n]
]

### X-05 Event rate
[
r_i[k]=\frac{n_i[k]}{\Delta}
]

### X-06 Population state
[
\mathbf z_k=[r_1[k],\ldots,r_N[k]]^\top
]

## Geometry / decoding

### X-07 Cosine tuning
[
f_i(\phi)=A+m\cos(\phi-\phi_i)+\nu
]

### X-08 Population vector
[
\hat{\mathbf d}_k=\frac{\sum_ir_i[k]\mathbf d_i}{\left\|\sum_ir_i[k]\mathbf d_i\right\|_2}
]

### X-09 Linear decoder
[
\hat{\mathbf u}_k=W\mathbf z_k+\mathbf b
]

### X-10 Position integration
[
\mathbf p_{k+1}=\mathbf p_k+\Delta\hat{\mathbf u}_k
]

### X-11 Ridge objective
[
W^*=\arg\min_W(\|U-WZ\|_F^2+\lambda\|W\|_F^2)
]

### X-12 Ridge solution
[
W^*=UZ^\top(ZZ^\top+\lambda I)^{-1}
]

## State estimation

### X-13 State transition
[
\mathbf x_k=A\mathbf x_{k-1}+\mathbf w_k,\quad\mathbf w_k\sim\mathcal N(\mathbf0,Q)
]

### X-14 Observation model
[
\mathbf z_k=C\mathbf x_k+\mathbf q_k,\quad\mathbf q_k\sim\mathcal N(\mathbf0,R)
]

### X-15 Bayesian filter
[
p(\mathbf x_k\mid\mathbf z_{1:k})\propto p(\mathbf z_k\mid\mathbf x_k)p(\mathbf x_k\mid\mathbf z_{1:k-1})
]

### X-16 Kalman prediction
[
\hat{\mathbf x}_{k|k-1}=A\hat{\mathbf x}_{k-1|k-1}
]

### X-17 Kalman covariance prediction
[
P_{k|k-1}=AP_{k-1|k-1}A^\top+Q
]

### X-18 Kalman gain
[
K_k=P_{k|k-1}C^\top(CP_{k|k-1}C^\top+R)^{-1}
]

### X-19 Kalman correction
[
\hat{\mathbf x}_{k|k}=\hat{\mathbf x}_{k|k-1}+K_k(\mathbf z_k-C\hat{\mathbf x}_{k|k-1})
]

### X-20 Covariance correction
[
P_{k|k}=(I-K_kC)P_{k|k-1}
]

## Classification / learning

### X-21 Logistic probability
[
P(c_k=1\mid\mathbf z_k)=\sigma(\mathbf w^\top\mathbf z_k+b),\quad\sigma(a)=\frac1{1+e^{-a}}
]

### X-22 Classification
[
\hat c_k=\mathbb1\{P(c_k=1\mid\mathbf z_k)>\gamma\}
]

### X-23 Gradient update
[
\theta_{k+1}=\theta_k-\eta\nabla_\theta\mathcal L_k
]

### X-24 Squared-error loss
[
\mathcal L_k=\|\mathbf u_k-\hat{\mathbf u}_k\|_2^2
]

## Drift / statistics

### X-25 Z-score
[
z_{i,e}=\frac{a_{i,e}-\mu_i}{\sigma_i}
]

### X-26 Session drift
[
\Delta r_{i,e}=\bar r_{i,e}-\bar r_{i,session}
]

### X-27 Decoded drift
[
\Delta\hat{\mathbf u}_k=W\Delta\mathbf z_k
]

### X-28 KS statistic
[
D_{n,m}=\sup_x|F_n(x)-G_m(x)|
]

### X-29 FDR criterion
[
p_{(j)}\le\frac jm\alpha
]

### X-30 Permutation p-value
[
\hat p=\frac{1+\sum_{b=1}^{B}\mathbb1[T^{*(b)}\ge T_{obs}]}{B+1}
]

## Kinematics / control

### X-31 Inverse kinematics
[
\dot{\mathbf q}=J(\mathbf q)^+\mathbf v_{hand}
]

### X-32 PID control
[
u(t)=K_pe(t)+K_i\int e(t)dt+K_d\frac{de(t)}{dt}
]

## Why these appear in LeeWay

They provide established patterns for sampling, filtering, estimation, control, inference and statistical verification. LeeWay's contribution is not to rename these equations, but to compose them with LeeWay state/governance/exactness/evidence rules where appropriate.
