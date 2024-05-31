<script lang="ts">
    import { JSTYPES } from "./util";

    export let value: String;
</script>

<select class="ms-auto w-25 form-select" bind:value {...$$restProps}>
    {#each Object.keys(JSTYPES) as keys }
        <option>{keys}</option>
    {/each}
</select>
