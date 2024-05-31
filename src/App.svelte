<script lang="ts">
  type FORMATTYPE = "plain" | "json" | "yaml" | "csv" | "sql";

  let inputRaw: string | null = null;
  let inputSize = null;
  let inputType: FORMATTYPE = "plain";
  let inputText = "";
  let functionText = "return content.trim();";
  let outputType: FORMATTYPE = "plain";
  let outputSize = null;
  let outputText = "";
  let outputLink = "";

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
  }
  function clearFile() {
    inputRaw = null;
    inputText = "";
  }

  async function process() {
    let processedContent;
    try {
      const userFunction = new Function("content", functionText);
      processedContent = userFunction(inputRaw || inputText);
      if (typeof processedContent != "string") {
        processedContent = JSON.stringify(processedContent);
      }
    } catch (error: any) {
      alert("Error in processing function: " + error?.message);
      return;
    }

    outputText =
      processedContent.length > 5000
        ? processedContent.slice(0, 5000) + "...."
        : processedContent;

    const blob = new Blob([processedContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    outputLink = url;
  }
</script>

<div class="container-fluid mt-5">
  <div class="row">
    <div class="col-6">
      <div class="mb-3">
        <label for="textInput" class="form-label">Input:</label>
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
        <textarea
          class="form-control"
          id="textInput"
          bind:value={inputText}
          rows={6}
          readonly={inputRaw !== null}
        ></textarea>
      </div>

      <div class="mb-3">
        <label for="jsFunction" class="form-label">JavaScript Function:</label>
        <textarea
          class="form-control font-monospace"
          id="jsFunction"
          rows="5"
          bind:value={functionText}
          placeholder="Enter your JavaScript function here"
        ></textarea>
      </div>

      <button class="btn btn-primary mb-3" on:click={process}>
        Process File
      </button>

      <div class="mb-3">
        <label for="outputText" class="form-label">Output:</label>
        <textarea
          class="form-control"
          id="outputText"
          bind:value={outputText}
          rows={6}
          readonly
        ></textarea>
      </div>

      <a
        id="downloadLink"
        class="btn btn-success"
        href={outputLink}
        download="modified.txt"
        class:d-none={!outputLink}
      >
        Download Modified File
      </a>
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
