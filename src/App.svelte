<script>
  import { onMount } from 'svelte';
  import { monteCarlo } from './stats'; 
  import ModelResults from './ModelResults.svelte';

  // seq = [9.9, 9.7, 10, 10.1, 9.9, 9.6, 9.8, 9.8, 10, 9.5, 9.7, 10.1, 9.9, 9.6, 10.2, 9.8, 10, 9.9, 9.5, 9.9];

  function handleKeyUp({key}) {
    if (key === 'Enter') {
      seq = [...seq, parseFloat(newItem)];
      newItem = '';
    }
  }

  let seq = [9.9, 9.7, 10, 10.1, 9.9, 9.6, 9.8, 9.8, 10, 9.5, 9.7, 10.1, 9.9, 9.6, 10.2, 9.8, 10, 9.9, 9.5, 9.9];
  const confidence = 0.95;
  $: mc = monteCarlo(seq);
  $: mci = () => mc.ci(confidence);
  const round = (num, prec) => {
    const m = Math.pow(10, prec);
    return Math.ceil(num * m) / m;
  };
  const roundConf = n => round(n, 3);
  $: newItem = '';
</script>

<main>
  <div class="input">
    <input type="text" bind:value={newItem} on:keyup={handleKeyUp} />
    {#each seq.reverse() as s}
      <p class="num">{s}</p>
    {/each}
  </div>
  <div class="info">
    <ModelResults
      sim={monteCarlo} {seq} {confidence}
      condition={v => v >= 10} />
  </div>
</main>

<style>
  main {
    display: flex;
    flex-direction: row;
    margin: auto;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  .info {
    padding-left: 50px;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  .info {
    text-align: center;
  }

  :global(.num) {
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
