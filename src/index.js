var mathf = require("mathf"),
    vec2 = require("vec2");


var mat32 = module.exports;


mat32.create = function(m11, m12, m13, m21, m22, m23) {
    return mat32.set(
        new mathf.ArrayType(6),
        m11, m12, m13,
        m21, m22, m23
    );
};

mat32.copy = function(a, b) {
    a[0] = b[0];
    a[1] = b[1];
    a[2] = b[2];
    a[3] = b[3];
    a[4] = b[4];
    a[5] = b[5];

    return a;
};

mat32.set = function(a, m11, m12, m13, m21, m22, m23) {

    a[0] = m11 !== undefined ? m11 : 1;
    a[2] = m12 !== undefined ? m12 : 0;
    a[1] = m21 !== undefined ? m21 : 0;
    a[3] = m22 !== undefined ? m22 : 1;
    a[4] = m13 !== undefined ? m13 : 0;
    a[5] = m23 !== undefined ? m23 : 0;

    return a;
};

mat32.identity = function(a) {
    a[0] = 1;
    a[1] = 0;
    a[2] = 0;
    a[3] = 1;
    a[4] = 0;
    a[5] = 0;

    return a;
};

mat32.zero = function(a) {
    a[0] = 0;
    a[1] = 0;
    a[2] = 0;
    a[3] = 0;
    a[4] = 0;
    a[5] = 0;

    return a;
};

mat32.mul = function(a, b, out) {
    var a11 = a[0],
        a12 = a[2],
        a13 = a[4],
        a21 = a[1],
        a22 = a[3],
        a23 = a[5],

        b11 = b[0],
        b12 = b[2],
        b13 = b[4],
        b21 = b[1],
        b22 = b[3],
        b23 = b[5];

    out = out || a;

    out[0] = a11 * b11 + a21 * b12;
    out[2] = a12 * b11 + a22 * b12;

    out[1] = a11 * b21 + a21 * b22;
    out[3] = a12 * b21 + a22 * b22;

    out[4] = a11 * b13 + a12 * b23 + a13;
    out[5] = a21 * b13 + a22 * b23 + a23;

    return out;
};

mat32.smul = function(a, s, out) {
    out = out || a;

    out[0] = a[0] * s;
    out[1] = a[1] * s;
    out[2] = a[2] * s;
    out[3] = a[3] * s;
    out[4] = a[4] * s;
    out[5] = a[5] * s;

    return out;
};

mat32.sdiv = function(a, s, out) {
    s = s !== 0 ? 1 / s : s;

    out = out || a;

    out[0] = a[0] * s;
    out[1] = a[1] * s;
    out[2] = a[2] * s;
    out[3] = a[3] * s;
    out[4] = a[4] * s;
    out[5] = a[5] * s;

    return out;
};

mat32.determinant = function(a) {

    return a[0] * a[3] - a[2] * a[1];
};

mat32.inverse = function(a, out) {
    var m11 = a[0],
        m12 = a[2],
        m13 = a[4],
        m21 = a[1],
        m22 = a[3],
        m23 = a[5],

        det = m11 * m22 - m12 * m21;

    out = out || a;

    if (det === 0) {
        return mat32.identity(out);
    }
    det = 1 / det;

    out[0] = m22 * det;
    out[1] = -m12 * det;
    out[2] = -m21 * det;
    out[3] = m11 * det;

    out[4] = (m21 * m23 - m22 * m13) * det;
    out[5] = -(m11 * m23 - m12 * m13) * det;

    return out;
};

mat32.transpose = function(a, out) {
    var tmp;

    out = out || a;

    if (out === a) {
        tmp = a[1];
        out[1] = a[2];
        out[2] = tmp;
    } else {
        out[0] = a[0];
        out[1] = a[2];
        out[2] = a[1];
        out[3] = a[3];
    }

    return out;
};

mat32.lookAt = function(out, eye, target) {
    var x = target[0] - eye[0],
        y = target[1] - eye[1],
        a = mathf.atan2(y, x) - mathf.HALF_PI,
        c = mathf.cos(a),
        s = mathf.sin(a);

    out[0] = c;
    out[1] = s;
    out[2] = -s;
    out[3] = c;

    return out;
};

mat32.compose = function(out, position, scale, angle) {
    var sx = scale[0],
        sy = scale[1],
        c = mathf.cos(angle),
        s = mathf.sin(angle);

    out[0] = c * sx;
    out[1] = s * sx;
    out[2] = -s * sy;
    out[3] = c * sy;

    out[4] = position[0];
    out[5] = position[1];

    return out;
};

mat32.decompose = function(a, position, scale) {
    var m11 = a[0],
        m12 = a[1],
        sx = vec2.lengthValues(m11, m12),
        sy = vec2.lengthValues(a[2], a[3]);

    position[0] = a[4];
    position[1] = a[5];

    scale[0] = sx;
    scale[1] = sy;

    return mathf.atan2(m12, m11);
};

mat32.setRotation = function(a, angle) {
    var c = mathf.cos(angle),
        s = mathf.sin(angle);

    a[0] = c;
    a[1] = s;
    a[2] = -s;
    a[3] = c;

    return a;
};

mat32.getRotation = function(a) {

    return mathf.atan2(a[1], a[0]);
};

mat32.setPosition = function(a, v) {

    a[4] = v[0];
    a[5] = v[1];

    return a;
};

mat32.getPosition = function(a, v) {

    v[0] = a[4];
    v[1] = a[5];

    return v;
};

mat32.extractPosition = function(a, out) {

    out[4] = a[4];
    out[5] = a[5];

    return out;
};

mat32.extractRotation = function(a, out) {
    var m11 = a[0],
        m12 = a[2],
        m21 = a[1],
        m22 = a[3],

        x = m11 * m11 + m21 * m21,
        y = m12 * m12 + m22 * m22,

        sx = x !== 0 ? 1 / mathf.sqrt(x) : 0,
        sy = y !== 0 ? 1 / mathf.sqrt(y) : 0;

    out[0] = m11 * sx;
    out[1] = m21 * sx;

    out[2] = m12 * sy;
    out[3] = m22 * sy;

    return out;
};

mat32.translate = function(a, v, out) {
    var x = v[0],
        y = v[1];

    out = out || a;

    out[4] = a[0] * x + a[2] * y + a[4];
    out[5] = a[1] * x + a[3] * y + a[5];

    return out;
};

mat32.rotate = function(a, angle, out) {
    var m11 = a[0],
        m12 = a[2],
        m21 = a[1],
        m22 = a[3],

        s = mathf.sin(angle),
        c = mathf.cos(angle);

    out = out || a;

    out[0] = m11 * c + m12 * s;
    out[1] = m11 * -s + m12 * c;
    out[2] = m21 * c + m22 * s;
    out[3] = m21 * -s + m22 * c;

    return out;
};

mat32.scale = function(a, v, out) {
    var x = v[0],
        y = v[1];

    out = out || a;

    out[0] = a[0] * x;
    out[1] = a[1] * x;
    out[4] = a[4] * x;

    out[2] = a[2] * y;
    out[3] = a[3] * y;
    out[5] = a[5] * y;

    return out;
};

mat32.orthographic = function(out, left, right, top, bottom) {
    var w = right - left,
        h = top - bottom,

        x = (right + left) / w,
        y = (top + bottom) / h;

    out[0] = 2 / w;
    out[1] = 0;
    out[2] = 0;
    out[3] = 2 / h;
    out[4] = -x;
    out[5] = -y;

    return out;
};

mat32.equal = function(a, b) {
    return !(
        a[0] !== b[0] ||
        a[1] !== b[1] ||
        a[2] !== b[2] ||
        a[3] !== b[3] ||
        a[4] !== b[4] ||
        a[5] !== b[5]
    );
};

mat32.notEqual = function(a, b) {
    return (
        a[0] !== b[0] ||
        a[1] !== b[1] ||
        a[2] !== b[2] ||
        a[3] !== b[3] ||
        a[4] !== b[4] ||
        a[5] !== b[5]
    );
};
