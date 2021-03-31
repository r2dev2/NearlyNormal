<script>
  export let sim = () => ({ });
  export let seq = [];
  export let confidence = 0.95;
  export let condition = () => false;

  const round = num => Math.ceil(num * 1000) / 1000;

  $: simRes  = sim(seq);
  $: p = simRes.p(condition);
  $: ci = simRes.ci(confidence);
  $: left = round(ci.left);
  $: right = round(ci.right);
</script>

<div>
  <p>P: <span class="num">{p}</span></p>
  <p>
    <span class="num">{confidence * 100}%</span>
    confidence interval:
    <span class="num">{left}</span> to
    <span class="num">{right}</span>
  </p>
</div>
