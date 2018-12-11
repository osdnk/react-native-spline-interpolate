export default function creteInterpolationSplines(x, y) {
    const n = x.length - 1;
    const deltas = [];
    for (let i = 0; i <= n - 1; i++) {
        deltas[i] = (y[i + 1] - y[i]) / (x[i + 1] - x[i]);
    }
    const thetas = [];
    for (let i = 0; i <= n - 2; i++) {
        thetas[i] = (deltas[i + 1] - deltas[i]) / (x[i + 2] - x[i]);
    }

    const h = [];
    for (let i = 0; i <= n - 1; i++) {
        h[i] = x[i + 1] - x[i];
    }

    const u = [];
    const w = [];
    for (let i = 0; i <= n - 3; i++) {
        u[i] = h[i + 1] / (h[i + 1] + h[i + 2]);
        w[i] = h[i + 1] / (h[i] + h[i + 1]);
    }

    const s = [];
    s[0] = u[0] / 2;

    for (let i = 1; i <= n - 3; i++) {
        s[i] = u[i] / (2 - w[i - 1] * s[i - 1]);
    }

    const z = [];
    z[0] = 2;

    for (let i = 1; i <= n - 2; i++) {
        z[i] = 2 - w[i - 1] * s[i - 1];
    }

    const m = [];
    m[0] = thetas[0];
    for (let i = 1; i <= n - 2; i++) {
        m[i] = thetas[i] - m[i - 1] * s[i - 1];
    }

    const l = [];
    for (let i = 0; i <= n - 3; i++) {
        l[i] = m[i] - m[i + 1] * w[i] / z[i + 1];
    }
    l[n - 2] = m[n - 2];

    const r = [];
    for (let i = 0; i <= n - 2; i++) {
        r[i + 1] = l[i] / z[i];
    }

    r[0] = 0; //magic
    r[n] = 0;

    const as = [];
    const bs = [];
    const cs = [];
    const ds = [];

    for (let i = 0; i <= n; i++) {
        cs[i] = r[i] * 6;
    }
    for (let i = 0; i <= n - 1; i++) {
        as[i] = y[i];
        bs[i] = deltas[i] - h[i] * (cs[i + 1] + 2 * cs[i]) / 6;
        ds[i] = (cs[i + 1] - cs[i]) / h[i];
    }

    return { as, bs, cs, ds };
}
