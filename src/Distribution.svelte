<script>
  import Chart from 'chart.js';
  import { normDist } from './stats';

  export let seq = null; // writable([])

  let ctx;
  let chart;

  $: seq.set($seq == [] ? Array(n).fill(1) : $seq);
  $: binWidth = $seq[$seq.length - 1] - $seq[0] / 5;
  $: norm = normDist(25, 5, 10) || [];
  $: scatPoints = norm
    .map((n, i) => ({ x: i * 5, y: Math.ceil(n / 10) }))
    .filter(({y}) => y > 0);

  $: scatLabels = [...scatPoints.map(p => p.x), 25];
  $: scatYs = scatPoints.map(p => p.y);
  $: fm = scatLabels[scatLabels.length - 2];
  $: sm = scatLabels[scatLabels.length - 1];
  $: n_ = scatYs.reduce((x, y) => x + y, 0);
  $: doChart(ctx)

  function doChart(ctx) {
    if (ctx == undefined) return;
    chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: scatLabels,
        datasets: [{
          label: 'Distribution',
          data: scatYs,
          backgroundColor: 'rgba(255, 99, 132, 1)',
          barPercentage: 1.2,
        }]
      },
      options: {
        animation: false,
        scales: {
          xAxes: [
            {
              display: false,
              ticks: {
                max: fm,
              }
            },
            {
              display: true,
              gridLines: { drawOnChartArea: false },
              ticks: {
                autoSkip: false,
                max: sm,
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
  }
</script>

<canvas class="dist" width="400" height="400" bind:this={ctx} />
