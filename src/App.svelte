<script lang="ts">
  import Editor from "./lib/Editor.svelte";
  import SelectFormat from "./lib/SelectFormat.svelte";
  import { JSTYPES, parse, stringify } from "./lib/util";

  type FORMATTYPE =
    | "plain"
    | "plain-lines"
    | "json"
    | "json-lines"
    | "yaml"
    | "csv"
    | "csv-object"
    | "sql"
    | "sql-object";

  let inputRaw: string | null = null;
  let inputSize = null;
  let inputEditor: Editor;
  let inputType: FORMATTYPE = "plain";
  let inputText = "";
  let functionText = "return content;";
  let functionEditor: Editor;
  let outputType: FORMATTYPE = "plain";
  let outputSize = null;
  let outputEditor: Editor;
  let outputText = "";
  let outputRaw = '';
  let outputLink = "";

  let visibleEditor = -1;

  function cap(s: string) {
    const CAP = 5000;
    return s.length > CAP ? s.slice(0, CAP) + "\n........ (truncated)" : s;
  }

  async function openFile() {
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    if (!fileInput) return;
    const file = fileInput.files?.[0];

    if (!file) {
      alert("Please select a file.");
      return;
    }
    const reader = new FileReader();

    inputRaw = await new Promise((resolve, reject) => {
      reader.onload = function (event: ProgressEvent<FileReader>) {
        let fileContent = event.target?.result;
        if (fileContent instanceof ArrayBuffer) {
          resolve(new TextDecoder().decode(fileContent));
        } else {
          resolve(fileContent || null);
        }
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
    inputText = cap(inputRaw || "");
    inputEditor.setReadOnly(true);
  }

  function clearFile() {
    inputRaw = null;
    inputText = "";
    inputEditor.setReadOnly(false);
  }

  async function process() {
    try {
      const finalInput = parse(inputRaw || inputText, inputType);
      const userFunction = new Function("content", functionText);
      outputRaw = stringify(userFunction(finalInput), outputType);
    } catch (error: any) {
      alert("Error in processing function: " + error?.message);
      return;
    }

    outputText = cap(outputRaw);

    const blob = new Blob([outputRaw], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    outputLink = url;
  }

  function updateEditor(i: number) {
    let next = i;
    return function () {
      let prev = visibleEditor;
      if (prev == 0) {
        if (inputRaw === null) {
          inputText = inputEditor.getText();
        }
      } else if (prev == 1) {
        let t = functionEditor.getText();
        if (t.startsWith("function ")) {
          t = t
            .split("\n")
            .slice(1, -1)
            .map((x) => (x.startsWith("    ") ? x.slice(4) : x))
            .join("\n");
        }
        functionText = t;
      } else if (prev == 2) {
      }

      if (next == 0) {
        if (inputRaw) {
          if (inputEditor.getText() !== inputRaw) {
            inputEditor.setReadOnly(false);
            inputEditor.setText(inputRaw);
            inputEditor.setReadOnly(true);
          }
        } else {
          inputEditor.setText(inputText);
        }
        outputEditor.setLanguage(inputType);
      } else if (next == 1) {
        functionEditor.setText(
          `function transform(content: ${JSTYPES[inputType]}): ${JSTYPES[outputType]} {\n${functionText
            .split("\n")
            .map((x) => "    " + x)
            .join("\n")}\n}`,
        );
      } else if (next == 2) {
        outputEditor.setReadOnly(false);
        outputEditor.setText(outputRaw);
        outputEditor.setReadOnly(true);
        outputEditor.setLanguage(outputType);
      }
      visibleEditor = next;
    };
  }
</script>

<div class="container-fluid">
  <div class="row">
    <div class="col-6 py-5">
      <div class="mb-3">
        <div class="d-flex align-items-center">
          <label for="textInput" class="form-label mb-0 me-2">Input: </label>
          {#if inputRaw === null}
            <label for="fileInput" class="btn btn-sm btn-success">
              Open File
              <input type="file" id="fileInput" on:input={openFile} />
            </label>
          {:else}
            <button
              type="button"
              on:click={clearFile}
              class="btn btn-sm btn-danger">Clear File</button
            >
          {/if}
          <SelectFormat bind:value={inputType} />
          <button
            type="button"
            class="btn btn-outline-secondary"
            on:click={updateEditor(0)}
            class:active={visibleEditor == 0}
          >
            👉
          </button>
        </div>
        <textarea
          class="form-control"
          id="textInput"
          bind:value={inputText}
          rows={6}
          readonly={inputRaw !== null || visibleEditor === 0}
        ></textarea>
      </div>

      <div class="mb-3">
        <div class="d-flex align-items-center">
          <label for="jsFunction" class="form-label mb-0">
            JavaScript Function:
          </label>
          <button
            type="button"
            class="ms-auto btn btn-outline-secondary"
            on:click={updateEditor(1)}
            class:active={visibleEditor == 1}
          >
            👉
          </button>
        </div>
        <textarea
          class="form-control font-monospace"
          id="jsFunction"
          rows="5"
          bind:value={functionText}
          placeholder="Enter your JavaScript function here"
          readonly={visibleEditor === 1}
        ></textarea>
      </div>

      <div class="d-flex mb-3">
        <button class="btn btn-primary" on:click={process}>
          Process File
        </button>
        <SelectFormat bind:value={outputType} />

        <button
          type="button"
          class="btn btn-outline-secondary"
          on:click={updateEditor(2)}
          class:active={visibleEditor == 2}
        >
          👉
        </button>
      </div>
      <div class="mb-3">
        <div class="d-flex align-items-center">
          <label for="outputText" class="form-label">Output:</label>

          <a
            id="downloadLink"
            class="ms-auto btn btn-sm btn-success"
            href={outputLink}
            download="modified.txt"
            class:d-none={!outputLink}
          >
            Download Modified File
          </a>
        </div>
        <textarea
          class="form-control"
          id="outputText"
          bind:value={outputText}
          rows={6}
          readonly
        ></textarea>
      </div>
    </div>
    <div class="col-6">
      <Editor
        bind:this={inputEditor}
        hidden={visibleEditor !== 0}
        initialConfig={() => ({
          language: "plaintext",
        })}
      />
      <Editor
        bind:this={functionEditor}
        hidden={visibleEditor !== 1}
        initialConfig={() => ({
          language: "typescript",
        })}
      />
      <Editor
        bind:this={outputEditor}
        hidden={visibleEditor !== 2}
        initialConfig={() => ({
          language: "plaintext",
          readOnly: true,
        })}
      />
    </div>
  </div>
</div>

<style>
  #fileInput {
    cursor: pointer;
    outline: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 0;
    overflow: hidden;
    opacity: 0;
  }
</style>
