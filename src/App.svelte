<script>
  import { onMount } from 'svelte';
  import { monteCarlo } from './stats'; 

  const seq = [9.9, 9.7, 10, 10.1, 9.9, 9.6, 9.8, 9.8, 10, 9.5, 9.7, 10.1, 9.9, 9.6, 10.2, 9.8, 10, 9.9, 9.5, 9.9];
  const confidence = 0.95;
  $: mc = monteCarlo(seq);
  const mci = () => mc.ci(confidence);
  const round = (num, prec) => {
    const m = Math.pow(10, prec);
    return Math.ceil(num * m) / m;
  };
  const roundConf = n => round(n, 3);
</script>

<main>
  <p>P: <span class="num">{mc.p(v => v >= 10)}</span></p>
  <p><span class="num">{confidence * 100}%</span>
    confidence interval:
    <span class="num">{roundConf(mci().left)}</span> to
    <span class="num">{roundConf(mci().right)}</span></p>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  .num {
    color: crimson;
    background-color: #F1F1F1;
    font-size: 105%;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
