<script lang="ts">
    import { editor } from "monaco-editor";
    import { onMount } from "svelte";

    let container: HTMLElement;
    let ed: editor.IStandaloneCodeEditor;
    export let hidden: boolean = false;
    export let initialConfig: () => editor.IStandaloneEditorConstructionOptions =
        () => ({});

    export function getText() {
        return ed.getValue();
    }

    export function setText(text: string) {
        // Select all text
        const fullRange = ed.getModel()?.getFullModelRange();

        // Apply the text over the range
        ed.executeEdits(null, [
            {
                text,
                // @ts-ignore
                range: fullRange,
            },
        ]);
    }

    export function setReadOnly(ro: boolean) {
        ed.updateOptions({
            readOnly: ro,
        });
    }

    export function setLanguage(lang: string) {
        let model = ed.getModel();
        if (!model) {
            return;
        }
        editor.setModelLanguage(model, lang);
    }

    onMount(() => {
        ed = editor.create(container, {
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
