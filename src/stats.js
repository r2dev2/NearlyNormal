import Statistics from 'statistics.js';


const MC_SIMS = 1e4;
const stats = new Statistics();
// stats is old and needs this reference :(
// there is a bug where it starts outputting .5 after a high enough value
const _tcdfCache = new Map();
const _tcdf = (num, df) => {
  if (num >= 8 && df >= 10 || num >= 10 && 3 <= df && df <= 10)
    return 1;

  const key = JSON.stringify([num, df]);
  if (_tcdfCache.has(key)) return _tcdfCache.get(key);
  const val = stats.studentsTCumulativeValue(num, df);
  _tcdfCache.set(key, val);
  return val;
}
const tcdf = (left, right, df) => _tcdf(right, 19) - _tcdf(left, 19);

window.stats = stats;

function monteCarloSample(seq) {
  const sample = [];
  seq.forEach(() => sample.push(rngChoice(seq)));
  return sample;
}

function mean(seq) {
  if (seq.length === 0) return NaN;
  return seq.reduce((sum, num) => sum + num) / seq.length;
}

function monteCarloMeans(seq) {
  const means = [];
  for (let i = 0; i < MC_SIMS; ++i) {
    means.push(mean(monteCarloSample(seq)));
  }
  return means;
}

export const Operator = {
  less: (l, r) => l < r,
  greater: (l, r) => l > r,
  notequal: (l, r) => l != r
};

export const OpString = {};
OpString[Operator.less] = '<';
OpString[Operator.greater] = '>';
OpString[Operator.notequal] = '≠';
OpString['<'] = Operator.less;
OpString['>'] = Operator.greater;
OpString['≠'] = Operator.notequal;

export function opString(op) {
  return OpString[op] || '';
};

export class HA {
  /**
   * h0 is the null hypothesis population value
   * operation is either Operator.less, operator.greater, or operator.notequal
   * ha: mu operation h0
   */
  constructor(operation, h0) {
    this.operation = operation;
    this.h0 = h0;
    this.condition = v => this.operation(v, this.h0);
  }

  toString() {
    if (this.operation == Operator.less) {
      return `u < ${this.h0}`;
    }
    if (this.operation == Operator.greater) {
      return `u > ${this.h0}`;
    }
    if (this.operation == Operator.notequal) {
      return `u ≠ ${this.h0}`;
    }
    return '';
  }
}

export function monteCarlo(seq, ha) {
  const { condition, operation, h0 } = ha;
  const means = monteCarloMeans(seq).sort();
  const mu = mean(seq);
  const { length: l } = means;
  const p = (() => {
    if (operation == Operator.notequal) {
      const less = means.filter(e => e < h0).length;
      const more = means.filter(e => e > h0).length;
      return 2 * Math.min(less, more) / l;
    }
    return means.filter(condition).length / l;
  })();

  return {
    p() {
      return p;
    },
    ci(level) {
      const lr = Math.floor(l * (1 - level) / 2);
      return { left: means[lr], right: means[l - lr] };
    }
  };
}

export function students(seq, ha) {
  const { condition, h0 } = ha;
  const mu = mean(seq);
  const df = seq.length - 1;

  const p = (() => {
      const tv = tval(seq, h0);
      const tcdf_df = (l, r) => tcdf(l, r, df);
      if (ha.operation == Operator.less)
        return tcdf_df(tv, 99);
      if (ha.operation == Operator.greater)
        return tcdf_df(-99, tv);
      if (ha.operation == Operator.notequal)
        return tcdf_df(-99, Math.min(tv, -tv)) * 2;
      return 0;
  })();

  const ciTable = new Map();
  const SE = se(seq);

  return {
    p() {
      return p;
    },
    ci(level) {
      if (!ciTable.has(level)) {
        const lr = invT(level, seq.length - 1) * SE;
        ciTable.set(level, { left: mu - lr, right: mu + lr });
      }
      return ciTable.get(level);
    }
  };
}

export function normDist(mu, s, binWidth) {
  const dist = stats.normalDistribution(mu, s);
  const pf = parseFloat;
  const keys = Object.keys(dist).sort((a, b) => pf(a) - pf(b));
  const groups = [{ start: Math.floor(pf(keys[0])), amt: 0 }];
  const gl = () => groups.length;
  for (const k of keys) {
    const ik = parseFloat(k);
    if (ik - groups[gl() - 1].start < binWidth) {
      groups[gl() - 1].amt += dist[k];
    }
    else {
      groups.push({ start: ik, amt: 1 });
    }
  }
  return [
    ...groups.map(o => ({...o, amt: Math.floor(o.amt)})),
    { end: groups[gl() - 1].start + binWidth }
  ];
}

export function extractSample(dist, n) {
  const scale = n / dist.reduce((x, y) => x + y.amt, 0);
  const bw = dist[1].start - dist[0].start;
  const sample = [];
  dist.forEach(d => {
    const needed = Math.ceil(d.amt * scale);
    if (needed) {
      const beg = d.start;
      const end = beg + bw;
      for (let i = 0; i < needed; ++i) {
        sample.push(Math.random() * (end - beg) + beg);
      }
    }
  });
  const beg = Math.floor((sample.length - n) / 2);
  return sample.slice(beg, beg + n);
}

function rngChoice(seq) {
  return seq[Math.floor(Math.random() * seq.length)];
}

function tval(seq, u0) {
  return (mean(seq) - u0) / se(seq);
}

function se(seq) {
  if (seq.length === 0) return Infinity;
  return stdDev(seq) / seq.length ** 0.5;
}

function stdDev(seq) {
  if (seq.length === 0) return Infinity;
  const mu = mean(seq);
  const variance = seq
    .map(num => (num - mu) ** 2)
    .reduce((sum, val) => sum + val, 0) /
    Math.max(1, seq.length - 1);
  return variance ** 0.5;
}

const _invTCache = new Map();

// POV: you don't want to figure out how invT actually works
function invT(conf, df, precision=0.001, pizdecc=5e2) {
  const key = JSON.stringify([conf, df]);
  if (_invTCache.has(key)) return _invTCache.get(key);
  let left = 0, right = 10, mid = 0;
  let count = 0;
  while (left < right && count++ < pizdecc) {
    mid = (left + right) / 2;
    if (tcdf(-mid, mid, df) > conf) {
      right = mid;
    }
    else {
      left = mid + precision;
    }
  }
  _invTCache.set(key, left);
  return left;
}
