<script>
  import { onMount } from 'svelte';
  import { monteCarlo, students, HA, Operator } from './stats'; 
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
  $: newItem = '';
  const ha = new HA(Operator.greater, 10);
</script>

<main>
  <div class="input">
    <input type="text" bind:value={newItem} on:keyup={handleKeyUp} />
    {#each seq.reverse() as s}
      <p class="num">{s}</p>
    {/each}
  </div>
  <div class="info">
    <h2>Monte Carlo</h2>
    <ModelResults
      sim={monteCarlo} {seq} {confidence} {ha}
      condition={v => v >= 10} />
  </div>
  <div class="info">
    <h2>Student's t model</h2>
    <ModelResults
      sim={students} {seq} {confidence} {ha}
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
