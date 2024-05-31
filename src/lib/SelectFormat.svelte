<script lang="ts">
    export let value: String;
</script>

<select class="ms-auto w-25 form-select" bind:value {...$$restProps}>
    <option>plain</option>
    <option>json</option>
    <option>yaml</option>
    <option>csv</option>
    <option>sql</option>
</select>
