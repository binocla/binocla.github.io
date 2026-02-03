(() => {
  const apiKeyEl = document.getElementById("apiKey");
  const langEl = document.getElementById("language");
  const formatEl = document.getElementById("format");
  const fileEl = document.getElementById("audioFile");
  const btnTranscribe = document.getElementById("btnTranscribe");
  const btnDownload = document.getElementById("btnDownload");
  const btnClear = document.getElementById("btnClear");
  const statusEl = document.getElementById("status");
  const outputEl = document.getElementById("output");
  const outputMeta = document.getElementById("outputMeta");

  if (!apiKeyEl || !langEl || !formatEl || !fileEl || !btnTranscribe || !btnDownload || !btnClear || !statusEl || !outputEl || !outputMeta) {
    return;
  }

  const MODEL = "gpt-4o-transcribe-diarize";
  const MAX_MB = 25;
  const MAX_BYTES = MAX_MB * 1024 * 1024;

  function setStatus(text, type) {
    statusEl.textContent = text || "";
    statusEl.classList.remove("ok", "err");
    if (type) statusEl.classList.add(type);
  }

  function setOutput(text) {
    outputEl.value = text || "";
    btnDownload.disabled = !outputEl.value.trim();
  }

  function setMeta(text) {
    outputMeta.textContent = text || "—";
  }

  async function transcribe() {
    const apiKey = apiKeyEl.value.trim();
    const language = (langEl.value || "ru").trim();
    const responseFormat = (formatEl.value || "text").trim();
    const file = fileEl.files && fileEl.files[0];
    if (!apiKey) {
      setStatus("Введите API ключ.", "err");
      return;
    }

    if (!file) {
      setStatus("Выберите аудиофайл.", "err");
      return;
    }
    if (file.size > MAX_BYTES) {
      setStatus(`Файл слишком большой (>${MAX_MB} МБ).`, "err");
      return;
    }
    setStatus("Загрузка и распознавание...", null);
    btnTranscribe.disabled = true;
    btnDownload.disabled = true;

    try {
      const form = new FormData();
      form.append("model", MODEL);
      form.append("file", file);
      form.append("language", language || "ru");
      const apiResponseFormat = responseFormat === "diarized_json" ? "json" : responseFormat;
      form.append("response_format", apiResponseFormat);
      form.append("chunking_strategy", "auto");

      const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`
        },
        body: form
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP ${response.status}`);
      }

      if (responseFormat === "text") {
        const text = await response.text();
        setOutput(text);
      } else {
        let data;
        try {
          data = await response.json();
        } catch {
          const text = await response.text();
          setOutput(text);
          setMeta(`${file.name} • ${language || "ru"} • ${responseFormat}`);
          setStatus("Готово.", "ok");
          return;
        }

        if (responseFormat === "diarized_json") {
          const formatted = formatDiarizedOutput(data);
          setOutput(formatted || data?.text || "");
        } else {
          setOutput(data?.text || "");
        }
      }
      setMeta(`${file.name} • ${language || "ru"} • ${responseFormat}`);
      setStatus("Готово.", "ok");
    } catch (err) {
      setStatus("Ошибка: " + (err?.message || "неизвестная"), "err");
    } finally {
      btnTranscribe.disabled = false;
    }
  }

  function formatDiarizedOutput(data) {
    const segments = Array.isArray(data?.segments) ? data.segments : [];
    if (!segments.length) return data?.text || "";

    const indexByLabel = new Map();
    let nextIndex = 1;

    function getDisplayLabel(rawLabel) {
      const label = String(rawLabel || "").trim();
      const key = label || "__unknown__";
      if (!indexByLabel.has(key)) indexByLabel.set(key, nextIndex++);
      return `Спикер ${indexByLabel.get(key)}`;
    }

    const outputLines = [];
    let currentLabel = null;
    let currentParts = [];

    function flush() {
      if (!currentLabel || !currentParts.length) return;
      const text = currentParts.join(" ").replace(/\s+/g, " ").trim();
      if (text) outputLines.push(`${currentLabel}: ${text}`);
      currentLabel = null;
      currentParts = [];
    }

    for (const segment of segments) {
      const text = segment?.text ? String(segment.text).trim() : "";
      if (!text) continue;
      const label = getDisplayLabel(segment?.speaker ?? "speaker");
      if (label !== currentLabel) flush();
      currentLabel = label;
      currentParts.push(text);
    }
    flush();

    return outputLines.join("\n\n");
  }

  function downloadText() {
    const text = outputEl.value || "";
    if (!text.trim()) return;

    const file = fileEl.files && fileEl.files[0];
    const baseName = file ? file.name.replace(/\.[^/.]+$/, "") : "transcript";
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${baseName}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }

  btnTranscribe.addEventListener("click", () => {
    transcribe();
  });

  btnDownload.addEventListener("click", () => {
    downloadText();
  });

  btnClear.addEventListener("click", () => {
    apiKeyEl.value = "";
    fileEl.value = "";
    formatEl.value = "diarized_json";
    setOutput("");
    setMeta("—");
    setStatus("");
  });
})();
