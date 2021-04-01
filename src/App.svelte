<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { monteCarlo, students, HA, Operator, opString, OpString } from './stats'; 
  import ModelResults from './ModelResults.svelte';
  import Distribution from './Distribution.svelte';


  function handleKeyUp({key}) {
    if (key === 'Enter') {
      seq = [...seq, parseFloat(newItem)];
      newItem = '';
    }
  }

  const seq = writable([]);
  seq.set([]);
  const confidence = 0.95;
  $: newItem = '';
  let h0 = 26;
  let sop = '<';
  $: op = OpString[sop];
  let n = 5;
  $: ha = new HA(op, parseFloat(h0));
</script>

<main>
  <!--
  <div class="input">
    <input type="text" bind:value={newItem} on:keyup={handleKeyUp} />
    {#each seq.reverse() as s}
      <p class="num">{s}</p>
    {/each}
  </div>-->
  <div class="input">
    <Distribution {seq} {n} />
    <input class="slider" type="range" min={2} max={60} bind:value={n} />
    <p>n={n}</p>
  </div>
  <div class="info-h0">
    <div class="info">
      <div>
        <h2>Monte Carlo</h2>
        <ModelResults
          sim={monteCarlo} seq={$seq} {confidence} {ha} />
      </div>
      <div>
        <h2>Student's t model</h2>
        <ModelResults
          sim={students} seq={$seq} {confidence} {ha} />
      </div>
    </div>
    <div class="h-picker">
      <p>
        H0: u =
        <input class="h-value" type="text" bind:value={h0} />
      </p>
      <p>
        HA: u
        <select bind:value={sop}>
          {#each Object.values(OpString) as disp}
            {#if (typeof disp) == 'string'}
              <option value={disp}>{disp}</option>
            {/if}
          {/each}
        </select>
        <input class="h-value" type="text" bind:value={h0} />
      </p>
    </div>
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

  .input, .info-h0 {
    text-align: center;
  }

  .h-value {
    width: 4em;
  }

  .info {
    width: 100%;
    display: flex;
    flex-direciton: row;
  }

  .info > div {
    padding-left: 50px;
    width: 30em;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
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

  .slider {
    -webkit-appearance: none;
    width: 100%;
    height: 15px;
    border-radius: 5px;  
    background: #d3d3d3;
    outline: none;
    opacity: 0.7;
    -webkit-transition: .2s;
    transition: opacity .2s;
  }

  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 25px;
    height: 25px;
    border-radius: 50%; 
    background: #4CAF50;
    cursor: pointer;
  }
  
  .slider::-moz-range-thumb {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: #4CAF50;
    cursor: pointer;
  }
</style>
