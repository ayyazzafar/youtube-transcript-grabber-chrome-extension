function addTranscriptButtons() {
  const thumbnails = document.querySelectorAll(
    "a#thumbnail:not(.transcript-button-added)"
  );

  thumbnails.forEach((thumbnail) => {
    const videoId = thumbnail.href?.match(
      /(?:\/|%3D|v=)([0-9A-Za-z_-]{11})(?:[%#?&]|$)/
    )?.[1];

    if (videoId) {
      const button = document.createElement("button");
      button.className = "transcript-button";
      button.innerHTML = "📝";
      button.title = "Copy transcript";

      button.addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();

        try {
          button.classList.add("loading");
          const transcript = await getTranscript(videoId);
          await navigator.clipboard.writeText(transcript);
          button.classList.remove("loading");
          button.classList.add("success");
          setTimeout(() => button.classList.remove("success"), 2000);
        } catch (error) {
          button.classList.remove("loading");
          button.classList.add("error");
          setTimeout(() => button.classList.remove("error"), 2000);
          console.error("Failed to get transcript:", error);
        }
      });

      thumbnail.appendChild(button);
      thumbnail.classList.add("transcript-button-added");
    }
  });
}

async function getTranscript(videoId) {
  const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`);
  const html = await response.text();

  // Extract captions data from YouTube's initial data
  const captionsMatch = html.match(/"captionTracks":\[(.*?)\]/);
  if (!captionsMatch) throw new Error("No captions found");

  const captionsData = JSON.parse(`[${captionsMatch[1]}]`);
  const englishCaptions = captionsData.find(
    (caption) => caption.languageCode === "en"
  );

  if (!englishCaptions) throw new Error("No English captions found");

  // Get transcript from the baseUrl
  const transcriptResponse = await fetch(englishCaptions.baseUrl);
  const transcriptXml = await transcriptResponse.text();

  // Parse XML and extract text
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(transcriptXml, "text/xml");
  const textElements = xmlDoc.getElementsByTagName("text");

  let transcript = "";
  for (const element of textElements) {
    transcript += element.textContent + " ";
  }

  return transcript.trim();
}

// Run initially and observe for dynamic content
addTranscriptButtons();
const observer = new MutationObserver(() => {
  addTranscriptButtons();
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
