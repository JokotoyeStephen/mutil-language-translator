const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "zh", name: "Chinese" },
  { code: "ar", name: "Arabic" },
  { code: "ru", name: "Russian" },
  { code: "ja", name: "Japanese" },
  { code: "hi", name: "Hindi" },
  { code: "pt", name: "Portuguese" },
  { code: "it", name: "Italian" },
  { code: "ko", name: "Korean" },
  { code: "tr", name: "Turkish" },
  { code: "uk", name: "Ukrainian" },
  { code: "pl", name: "Polish" },
  { code: "nl", name: "Dutch" },
  { code: "yo", name: "Yoruba" },
  { code: "ig", name: "Igbo" },
  { code: "sw", name: "Swahili" },
  { code: "ha", name: "Hausa" },
  { code: "zu", name: "Zulu" },
  { code: "fa", name: "Persian" },
  { code: "ms", name: "Malay" },
  { code: "bn", name: "Bengali" },
  { code: "th", name: "Thai" },
  { code: "vi", name: "Vietnamese" },
  { code: "id", name: "Indonesian" },
  { code: "no", name: "Norwegian" },
  { code: "sv", name: "Swedish" },
  { code: "fi", name: "Finnish" },
  { code: "el", name: "Greek" },
  { code: "he", name: "Hebrew" },
  { code: "cs", name: "Czech" },
  { code: "ro", name: "Romanian" },
  { code: "sr", name: "Serbian" },
  { code: "hr", name: "Croatian" },
  { code: "hu", name: "Hungarian" },
  { code: "ta", name: "Tamil" },
  { code: "te", name: "Telugu" },
  { code: "ml", name: "Malayalam" },
  { code: "mr", name: "Marathi" },
  { code: "kn", name: "Kannada" },
  { code: "pa", name: "Punjabi" },
  { code: "gu", name: "Gujarati" },
  { code: "am", name: "Amharic" },
  { code: "ne", name: "Nepali" },
  { code: "my", name: "Burmese" },
  { code: "km", name: "Khmer" },
  { code: "lo", name: "Lao" },
  { code: "mn", name: "Mongolian" },
  { code: "ur", name: "Urdu" },
  { code: "sd", name: "Sindhi" },
  { code: "ps", name: "Pashto" },
  { code: "kk", name: "Kazakh" },
  { code: "uz", name: "Uzbek" },
  { code: "ky", name: "Kyrgyz" },
  { code: "az", name: "Azerbaijani" },
  { code: "be", name: "Belarusian" },
  { code: "bg", name: "Bulgarian" },
  { code: "lt", name: "Lithuanian" },
  { code: "lv", name: "Latvian" },
  { code: "et", name: "Estonian" },
  { code: "sl", name: "Slovenian" },
  { code: "sk", name: "Slovak" },
  { code: "ga", name: "Irish" },
  { code: "cy", name: "Welsh" },
  { code: "mt", name: "Maltese" },
  { code: "sq", name: "Albanian" },
  { code: "bs", name: "Bosnian" },
  { code: "is", name: "Icelandic" },
  { code: "af", name: "Afrikaans" },
  { code: "xh", name: "Xhosa" },
  { code: "st", name: "Sesotho" },
  { code: "rw", name: "Kinyarwanda" },
  { code: "so", name: "Somali" },
  { code: "sn", name: "Shona" },
  { code: "ny", name: "Chichewa" },
  { code: "sm", name: "Samoan" },
  { code: "to", name: "Tongan" },
  { code: "fj", name: "Fijian" },
  { code: "haw", name: "Hawaiian" },
  { code: "tl", name: "Filipino" },
  { code: "ceb", name: "Cebuano" },
  { code: "jv", name: "Javanese" },
  { code: "su", name: "Sundanese" },
  { code: "la", name: "Latin" },
  { code: "eo", name: "Esperanto" },
  { code: "gl", name: "Galician" },
  { code: "ca", name: "Catalan" },
  { code: "eu", name: "Basque" },
  { code: "oc", name: "Occitan" },
  { code: "br", name: "Breton" },
  { code: "sa", name: "Sanskrit" },
  { code: "ug", name: "Uyghur" },
  { code: "yi", name: "Yiddish" }
];

const sourceLang = document.getElementById("sourceLang");
const targetLang = document.getElementById("targetLang");
const inputText = document.getElementById("inputText");
const translatedText = document.getElementById("translatedText");
const errorDiv = document.getElementById("error");
const swapBtn = document.getElementById("swap");

function populateLangSelects() {
  LANGUAGES.forEach(({ code, name }) => {
    const option1 = new Option(name, code);
    const option2 = new Option(name, code);
    sourceLang.appendChild(option1);
    targetLang.appendChild(option2);
  });
  sourceLang.value = "en";
  targetLang.value = "es";
}
populateLangSelects();

// Swap languages
swapBtn.addEventListener("click", () => {
  const temp = sourceLang.value;
  sourceLang.value = targetLang.value;
  targetLang.value = temp;
  inputText.value = translatedText.textContent;
  translatedText.textContent = "";
  autoTranslate();
});

// Live Translation Logic
let debounceTimer;

function triggerLiveTranslate() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    autoTranslate();
  }, 500); // Debounce delay
}

inputText.addEventListener("input", triggerLiveTranslate);
sourceLang.addEventListener("change", autoTranslate);
targetLang.addEventListener("change", autoTranslate);

async function autoTranslate() {
  const text = inputText.value.trim();
  if (!text || sourceLang.value === targetLang.value) {
    translatedText.textContent = "";
    errorDiv.textContent = "";
    return;
  }

  errorDiv.textContent = "";
  translatedText.textContent = "⏳ Translating...";

  try {
    const response = await fetch("http://localhost:5000/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        q: text,
        source: sourceLang.value,
        target: targetLang.value,
        format: "text"
      })
    });
    // ================== SPEECH FEATURE ================== //
const speakBtn = document.getElementById("speakBtn");
const translatedText = document.getElementById("translatedText");

speakBtn.addEventListener("click", () => {
  const text = translatedText.textContent.trim();

  if (!text) {
    alert("Nothing to speak!");
    return;
  }

  // Create a speech synthesis utterance
  const utterance = new SpeechSynthesisUtterance(text);

  // Optionally set language to match targetLang dropdown
  const targetLang = document.getElementById("targetLang").value;
  if (targetLang) {
    utterance.lang = targetLang; // Example: "en", "fr", "es"
  }

  // Speak it
  speechSynthesis.speak(utterance);
});
  

    const data = await response.json();
    if (!response.ok || !data.translatedText) {
      throw new Error(data.error || "Translation failed.");
    }

    translatedText.textContent = data.translatedText;
  } catch (err) {
    translatedText.textContent = "";
    errorDiv.textContent = "❌ " + err.message;
  }
}
