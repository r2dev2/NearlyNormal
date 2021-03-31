'use strict';

import Statistics from 'statistics.js';

const MC_SIMS = 1e4;
const stats = new Statistics();
// stats is old and needs this reference :(
const _tcdf = (...args) => stats.studentsTCumulativeValue(...args);
const tcdf = (left, right, df) => _tcdf(right, 19) - _tcdf(left, 19);

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
  const { condition } = ha;
  const means = monteCarloMeans(seq).sort();
  const { length: l } = means;
  return {
    // Use binary search later if this is too slow
    p() {
      return means.filter(condition).length / l;
    },
    ci(level) {
      const lr = Math.floor(l * (1 - level) / 2);
      return { left: means[lr], right: means[l - lr] };
    }
  };
}

export function students(seq, ha) {
  const { condition } = ha;
  const mu = mean(seq);

  // TODO get a better way to set u0
  return {
    p() {
      const tv = tval(seq, 10);
      return tcdf(-99, tv, seq.length - 1);
    },
    ci(level) {
      const lr = invT(level, seq.length - 1) * se(seq);
      return { left: mu - lr, right: mu + lr };
    }
  };
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

// POV: you don't want to figure out how invT actually works
function invT(conf, df, precision=0.001, pizdecc=1e4) {
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
  return left;
}
