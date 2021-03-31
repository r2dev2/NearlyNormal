const MC_SIMS = 1e4;

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

export function monteCarlo(seq) {
  const means = monteCarloMeans(seq).sort();
  const { length: l } = means;
  return {
    // Use binary search later if this is too slow
    p(condition) {
      return means.reduce((sum, num) => sum + condition(num), 0) / l;
    },
    ci(level) {
      const lr = Math.floor(l * (1 - level) / 2);
      return { left: means[lr], right: means[l - lr] };
    }
  };
}

function rngChoice(seq) {
  return seq[Math.floor(Math.random() * seq.length)];
}
