<script lang="ts">
    import type { editor } from "monaco-editor";
    import { onMount } from "svelte";

    let monaco;
    let container: HTMLElement;
    let editor: editor.IStandaloneCodeEditor;
    export let hidden: boolean = false;

    export function getText() {
        return editor.getValue();
    }

    export function setText(text: string) {
        // Select all text
        const fullRange = editor.getModel()?.getFullModelRange();

        // Apply the text over the range
        editor.executeEdits(null, [
            {
                text,
                // @ts-ignore
                range: fullRange,
            },
        ]);
    }
    onMount(() => {
        import("./monaco.js").then(async (mod) => {
            monaco = mod.default;
            editor = monaco.editor.create(container, {
                value: ["// Click left items to start editing"].join("\n"),
                language: "js",
                theme: "vs-dark",
                wordWrap: "on",
                automaticLayout: true,
            });
        });
    });
</script>

<div class="monaco-container w-100 vh-100" class:d-none={hidden} bind:this={container}></div>
