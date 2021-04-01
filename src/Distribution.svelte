<script>
  import { normDist } from './stats';

  export let seq = null; // writable([])
  export let n = 10;

  $: seq.set($seq == [] ? Array(n).fill(1) : $seq);
  $: binWidth = $seq[$seq.length - 1] - $seq[0] / 5;
</script>
