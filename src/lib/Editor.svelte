<script lang="ts">
    import type { editor } from "monaco-editor";
    import { onMount } from "svelte";
    import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

    let container: HTMLElement;
    let editor: editor.IStandaloneCodeEditor;
    export let hidden: boolean = false;
    export let initialConfig: () => editor.IStandaloneEditorConstructionOptions =
        () => ({});

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

    export function setReadOnly(ro: boolean) {
        editor.updateOptions({
            readOnly: ro,
        });
    }

    export function setLanguage(lang: string) {
        let model = editor.getModel();
        if (!model) {
            return;
        }
        monaco.editor.setModelLanguage(model, lang);
    }

    onMount(() => {
        editor = monaco.editor.create(container, {
            ...initialConfig(),
            theme: "vs-dark",
            wordWrap: "on",
            automaticLayout: true,
        });
    });
</script>

<div
    class="monaco-container w-100 vh-100"
    class:d-none={hidden}
    bind:this={container}
></div>
