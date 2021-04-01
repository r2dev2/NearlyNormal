<script>
  import { writable } from 'svelte/store';
  import { extractSample, normDist } from './stats';

  export let seq = writable([]); // writable([])
  export let n = 10;

  let bins = [];

  $: bins = bins.length ? bins : normDist(25, 5, 3);
  $: groups = bins.filter(e => e.start != null);
  $: seq.set($seq.length == 0
    ? extractSample(groups, n)
    : $seq
  );
  $: maxX = bins[bins.length - 1].end;
  $: maxVal = Math.max(...groups.map(e => e.amt));

  function handleBarMouseMove(bin) {
    return e => {
      if (e.buttons == 1) {
        const pHeight = parseFloat(getComputedStyle(
          e.target.parentElement.querySelector('.bar')
        ).height);
        const dy = e.clientY - e.target.getBoundingClientRect().y;
        const da = dy / pHeight;
        bin.amt += da;
        bins = bins;
      }
    }
  }
</script>

<div class="dist">
  <div class="bins">
    {#each groups as bin}
      <div class="bar-container">
        <p class="bar-label">{bin.start == null ? bin.end : bin.start}</p>
        <div class="bar" style="height: {bin.amt / 3}em" />
        <div
          class="bar-handle"
          on:mousemove={handleBarMouseMove(bin)} />
      </div>
    {/each}
  </div>
</div>

<style>
  .bins {
    display: flex;
    flex-direction: row;
    transform: scaleY(-1);
  }

  .bar-label {
    position: relative;
    transform: scaleY(-1);
    left: -10px;
    top: 15px;
  }

  .bins > :not(last-child) {
    margin-right: 2px;
  }

  .bar {
    width: 2em;
    min-height: 1px;
    background-color: crimson;
  }

  .bar-handle {
    width: 2em;
    height: 20px;
    cursor: n-resize;
    top: -10px;
    position: relative;
  }
</style>
