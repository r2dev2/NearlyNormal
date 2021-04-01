<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { monteCarlo, students, HA, Operator } from './stats'; 
  import ModelResults from './ModelResults.svelte';
  import Distribution from './Distribution.svelte';

  // seq = [9.9, 9.7, 10, 10.1, 9.9, 9.6, 9.8, 9.8, 10, 9.5, 9.7, 10.1, 9.9, 9.6, 10.2, 9.8, 10, 9.9, 9.5, 9.9];

  function handleKeyUp({key}) {
    if (key === 'Enter') {
      seq = [...seq, parseFloat(newItem)];
      newItem = '';
    }
  }

  const seq = writable([]);
  seq.set([]);
  // seq.set([9.6047347 , 6.17765428, 8.73165541, 8.36166615, 7.88580571, 9.62242183, 6.34099005, 7.26507479, 6.79458638, 8.06210016]);
  // let seq = [9.9, 9.7, 10, 10.1, 9.9, 9.6, 9.8, 9.8, 10, 9.5, 9.7, 10.1, 9.9, 9.6, 10.2, 9.8, 10, 9.9, 9.5, 9.9];
  const confidence = 0.95;
  $: newItem = '';
  let h0 = 26;
  let op = Operator.greater;
  let n = 5;
  $: ha = new HA(op, h0);
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
  <div class="info">
    <h2>Monte Carlo</h2>
    <ModelResults
      sim={monteCarlo} seq={$seq} {confidence} {ha} />
  </div>
  <div class="info">
    <h2>Student's t model</h2>
    <ModelResults
      sim={students} seq={$seq} {confidence} {ha} />
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

  .input {
    text-align: center;
  }

  .info {
    padding-left: 50px;
    width: 30em;
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
