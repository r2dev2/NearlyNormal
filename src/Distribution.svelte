<script>
  import { onMount, onDestroy, tick } from 'svelte';
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

  let onMouseMove = () => { };
  let target = null;
  let targetBar = null;

  function handleBarMouseMove(bin) {
    return e => {
      if (e.buttons == 1 && target != null) {
        if (bin.amt == 0) {
          bin.amt = 1;
          bins = bins;
        }
        const pHeight = parseFloat(getComputedStyle(
          targetBar
        ).height);
        const { top, bottom } = target.getBoundingClientRect();
        const ogPos = (top + bottom) / 2;
        const dy = ogPos - e.clientY;
        const dm = (pHeight + dy) / pHeight;
        bin.amt *= dm;
        bin.amt = Math.min(Math.max(bin.amt, 0), 50);
        bins = bins;
      }
    }
  }

  function onWinMouseUp() {
    target = null;
    targetBar = null;
    onMouseMove = () => { };
  }
  onMount(() => window.addEventListener('mouseup', onWinMouseUp));
  onDestroy(() => window.removeEventListener('mouseup', onWinMouseUp));
    
</script>

<svelte:window
  on:mousedown={e => { target = e.target; targetBar = target.parentElement.querySelector('.bar') }}
  on:mousemove={e => onMouseMove(e)} />


<div class="dist">
  <div class="bins">
    {#each groups as bin}
      <div class="bar-container">
        <p class="bar-label">{bin.start == null ? bin.end : bin.start}</p>
        <div class="bar" style="height: {bin.amt / 3}em" />
        <div
          class="bar-handle"
          on:mousedown={(b => onMouseMove = handleBarMouseMove(b))(bin)} />
      </div>
    {/each}
  </div>
</div>

<style>
  .bins {
    display: flex;
    flex-direction: row;
    transform: scaleY(-1);
    height: 20em;
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
