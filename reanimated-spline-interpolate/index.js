import Animated from 'react-native-reanimated';
import creteInterpolationSplines from 'react-native-spline-interpolate';

const { cond, add, multiply, lessThan, sub, pow } = Animated;

export default function splineInterpolate(V, config) {
    const { inputRange: X, outputRange: Y } = config;
    const { as, bs, cs, ds } = creteInterpolationSplines(X, Y);
    const n = X.length - 1;
    let h = sub(V, X[n - 1]);
    let t =
    add(
        as[n - 1],
        multiply(bs[n - 1], h),
        multiply(cs[n - 1], pow(h, 2), 0.5),
        multiply(ds[n - 1], pow(h, 3), 1 / 6)
    );
    for (let i = n - 1; i >= 1; i--) {
        h = sub(V, X[i - 1]);
        t = cond(
            lessThan(V, X[i]),
            add(
                as[i - 1],
                multiply(bs[i - 1], h),
                multiply(cs[i - 1], pow(h, 2), 0.5),
                multiply(ds[i - 1], pow(h, 3), 1 / 6)
            ),
            t
        );
    }
    t = cond(lessThan(V, X[0]), 0, t);
    return t;
}
