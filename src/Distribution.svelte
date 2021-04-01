<script>
  import { onMount } from 'svelte';
  import Chart from 'chart.js';
  import { normDist } from './stats';

  export let seq = null; // writable([])
  export let n = 2;

  let ctx;
  let chart;

  $: seq.set($seq == [] ? Array(n).fill(1) : $seq);
  $: binWidth = $seq[$seq.length - 1] - $seq[0] / 5;
  $: norm = normDist(25, 5, 10) || [];
  $: scatPoints = norm
    .map((n, i) => ({ x: i * 5, y: Math.ceil(n / 10) }));
  $: scatLabels = scatPoints.map(p => p.x);
  $: scatYs = scatPoints.map(p => p.y);
  $: n_ = scatYs.reduce((x, y) => x + y, 0);

  onMount(() => {
    chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: scatLabels,
        datasets: [{
          label: 'Distribution',
          data: scatYs,
          backgroundColor: 'rgba(255, 99, 132, 1)'
        }]
      },
      options: {
        animation: false,
        scales: {
          xAxes: [
            {
              display: false,
              barPercentage: 1.3,
              ticks: {
                max: 3,
              }
            },
            {
              display: true,
              ticks: {
                autoSkip: false,
                max: 4,
              }
            }
          ],
          yAxes: [{
            ticks: {
              max: Math.max(...scatYs) + 2,
              beginAtZero:true
            }
          }]
        }
      }
    });
  });
</script>

<canvas class="dist" width="400" height="400" bind:this={ctx} />
