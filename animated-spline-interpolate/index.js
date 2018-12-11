import { Animated } from 'react-native';


import creteInterpolationSplines from 'react-native-spline-interpolate';

const EPS = 0.000001;

function add(...args) {
    let c = args[args.length - 1];
    for (let i = args.length - 2; i >= 0; i--) {
        c = Animated.add(args[i], c);
    }
    return c;
}

function multiply(...args) {
    let c = args[args.length - 1];
    for (let i = args.length - 2; i >= 0; i--) {
        c = Animated.multiply(args[i], c);
    }
    return c;
}

function sub(a, b) {
    return Animated.add(a, Animated.multiply(b, -1));
}

function pow(a, n) {
    let c = a;
    for (let i = 1; i < n; i++) {
        c = Animated.multiply(c, a);
    }
    return c;
}

function ranger(v, a, b) {
    return function(x, y) {
        return v.interpolate({
            inputRange: [a - EPS, x - EPS, x, y, y, b],
            outputRange: [0, 0, 1, 1, 0, 0]
        });
    };
}

export default function splineInterpolate(V, config) {
    const { inputRange: X, outputRange: Y } = config;
    const { as, bs, cs, ds } = creteInterpolationSplines(X, Y);
    const r = ranger(V, X[0], X[X.length - 1]);

    let h = sub(V, X[0]);

    let t = multiply(
        r(X[0], X[1]),
        add(
            as[0],
            multiply(bs[0], h),
            multiply(cs[0], pow(h, 2), 0.5),
            multiply(ds[0], pow(h, 3), 1 / 6)
        )
    );

    for (let i = 1; i < X.length - 1; i++) {
        h = sub(V, X[i]);
        t = add(
            multiply(
                r(X[i], X[i + 1]),
                add(
                    as[i],
                    multiply(bs[i], h),
                    multiply(cs[i], pow(h, 2), 0.5),
                    multiply(ds[i], pow(h, 3), 1 / 6)
                )
            ),
            t
        );
    }
    return t;
}
