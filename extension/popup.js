const readButton = document.getElementById("readPage");
const analyzeButton = document.getElementById("analyzeButton");

const userPrompt = document.getElementById("userPrompt");
const pageInfo = document.getElementById("pageInfo");

const statusText = document.getElementById("status");
const resultBox = document.getElementById("result");

let currentPage = null;


// 1. Read the current webpage

readButton.addEventListener("click", async () => {

    statusText.textContent = "Reading webpage...";
    analyzeButton.disabled = true;
    currentPage = null;
    resultBox.textContent = "";

    try {

        const [tab] = await chrome.tabs.query({
            active: true,
            currentWindow: true
        });

        if (!tab || tab.id === undefined) {
            throw new Error("No active tab found.");
        }

        const results = await chrome.scripting.executeScript({
            target: {
                tabId: tab.id
            },

            func: () => {

    // 1. Find the main content
    const mainContent =
        document.querySelector("main") ||
        document.querySelector("article") ||
        document.querySelector('[role="main"]') ||
        document.body;

    // 2. Create a copy of the content
    const clonedContent = mainContent.cloneNode(true);

    // 3. Remove unnecessary elements
    clonedContent.querySelectorAll(
        "script, style, noscript, svg"
    ).forEach(element => element.remove());

    // 4. Extract visible and hidden text
    const text = clonedContent.textContent
        .replace(/\u00a0/g, " ")
        .replace(/[ \t]+/g, " ")
        .replace(/\n\s*\n+/g, "\n")
        .trim();

    // 5. Return the extracted content
    return {
        page_text: text.slice(0, 25000),
        original_length: text.length
    };
}
        });

        const extracted = results[0]?.result;

        if (!extracted?.page_text) {
            throw new Error("No readable webpage text found.");
        }

        currentPage = {
            page_text: extracted.page_text,
            page_url: tab.url || null
        };

        const truncated =
            extracted.original_length > extracted.page_text.length;

        pageInfo.textContent =
            `Title: ${tab.title || "Unknown"}\n` +
            `Extracted: ${extracted.page_text.length} characters\n` +
            `Original: ${extracted.original_length} characters` +
            (truncated ? "\nWarning: Content was truncated." : "");

        statusText.textContent = "Page successfully read.";

        analyzeButton.disabled = false;

    } catch (error) {

        pageInfo.textContent = "Could not read the webpage.";
        statusText.textContent = error.message;

    }

});


// 2. Send data to Python

analyzeButton.addEventListener("click", async () => {

    const prompt = userPrompt.value.trim();

    if (!prompt) {
        statusText.textContent = "Please describe your profile.";
        return;
    }

    if (!currentPage) {
        statusText.textContent = "Please read a webpage first.";
        return;
    }

    analyzeButton.disabled = true;
    statusText.textContent = "Sending data to Python...";

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/analyze",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    user_prompt: prompt,
                    page_text: currentPage.page_text,
                    page_url: currentPage.page_url
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                `HTTP ${response.status}: ${JSON.stringify(data.detail || data)}`
            );
        }

        resultBox.textContent = data.analysis || "No analysis available.";

        statusText.textContent = "Python backend responded successfully.";

    } catch (error) {

        statusText.textContent = `Error: ${error.message}`;

    } finally {

        analyzeButton.disabled = false;

    }

});