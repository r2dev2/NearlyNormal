<script>
  export let sim = () => ({ });
  export let seq = [];
  export let confidence = 0.95;
  export let ha;

  const round = num => `${Math.ceil(num * 1000) / 1000}`
    .padEnd(6, 0);

  $: simRes = sim(seq, ha);
  $: p = simRes.p(ha.condition);
  $: ci = simRes.ci(confidence / 100);
  $: left = round(ci.left);
  $: right = round(ci.right);
</script>

<div>
  <p>P: <span class="num">{p.toFixed(8)}</span></p>
  <p>
    <span class="num">{confidence}%</span>
    confidence interval:
    <span class="num">{left}</span> to
    <span class="num">{right}</span>
  </p>
</div>
