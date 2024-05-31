<script lang="ts">
  type FORMATTYPE = "plain" | "json" | "yaml" | "csv" | "sql";

  let inputRaw = null;
  let inputSize = null;
  let inputType: FORMATTYPE = "plain";
  let inputText = "";
  let functionText = "return content.trim();";
  let outputType: FORMATTYPE = "plain";
  let outputSize = null;
  let outputText = "";
  let outputLink = "";

  async function process() {
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (!file) {
      alert("Please select a file.");
      return;
    }

    const reader = new FileReader();

    const fileContent = await new Promise((resolve, reject) => {
      reader.onload = function (event: ProgressEvent<FileReader>) {
        const fileContent = event.target?.result;
        resolve(fileContent);
      };
      reader.readAsText(file);
    });

    let processedContent;
    try {
      const userFunction = new Function("content", functionText);
      processedContent = userFunction(fileContent);
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
        <label for="fileInput" class="form-label">Select TXT file:</label>
        <input type="file" class="form-control" id="fileInput" accept=".txt" />
        <textarea class="form-control" bind:value={inputText} rows={6}
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
