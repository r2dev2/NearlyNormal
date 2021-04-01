<script>
  import { extractSample, normDist } from './stats';

  export let seq = null; // writable([])
  export let n = 10;

  $: console.log(normDist(25, 5, 3));
  $: console.log(extractSample(normDist(25, 5, 3)
    .filter(e => e.start != null), 10));
</script>
