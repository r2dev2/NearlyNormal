<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { monteCarlo, students, HA, Operator, opString, OpString } from './stats'; 
  import ModelResults from './ModelResults.svelte';
  import Distribution from './Distribution.svelte';

  const seq = writable([]);
  let confidence = 95;
  let h0 = 26;
  let sop = '>';
  let n = 5;
  $: op = OpString[sop];
  $: ha = new HA(op, parseFloat(h0));
</script>

<main>
  <div class="input">
    <h2>Sample Distribution</h2>
    <Distribution {seq} {n} />
    <input id="n-slider" class="slider" type="range" min={2} max={60} bind:value={n} />
    <label for="n-slider">n={n}</label>
  </div>
  <div class="info-h0">
    <div class="info">
      <div>
        <h2>Monte Carlo</h2>
        <ModelResults sim={monteCarlo} seq={$seq} {confidence} {ha} />
      </div>
      <div>
        <h2>Student's t model</h2>
        <ModelResults sim={students} seq={$seq} {confidence} {ha} />
      </div>
    </div>
    <div class="h-picker-conf">
      <div class="h-picker">
        <p>
          H<sub>0</sub>: μ =
          <input id="h0-value" class="h-value" type="text" bind:value={h0} />
          <label for="h0-value" style="font-size: 0px">{h0}</label>
        </p>
        <p>
          H<sub>A</sub>: μ
          <select bind:value={sop}>
            {#each Object.values(OpString) as disp}
              {#if (typeof disp) == 'string'}
                <option value={disp}>{disp}</option>
              {/if}
            {/each}
          </select>
          <input id="ha-value" class="h-value" type="text" bind:value={h0} />
          <label for="ha-value" style="font-size: 0px">{h0}</label>
        </p>
      </div>
      <div class="conf-slider">
        <label for="confidence">
          Confidence: <span class="num">{confidence}%</span>
        </label>
        <input
          id="confidence"
          class="slider"
          type="range"
          min={1} max={99} bind:value={confidence} />
      </div>
    </div>
  </div>
</main>

<style>
  main {
    display: flex;
    flex-direction: row;
    margin: auto;
    padding: 1em;
    width: max-content;
    margin: auto;
  }

  .h-picker {
    margin: auto;
    text-align: left;
    width: max-content;
  }

  .conf-slider {
    padding-top: 7%;
    width: 50%;
    margin: auto;
  }

  .conf-slider > label {
    padding-bottom: 2%;
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

  :global(.num) {
    color: crimson;
    background-color: #FFFFFF;
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
