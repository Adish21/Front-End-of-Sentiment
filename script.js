const positiveWords = ["growth", "gain", "profit", "improve", "strong", "increase"];
const negativeWords = ["loss", "decline", "drop", "weak", "fall", "crash"];
const neutralWords = ["average", "stable", "unchanged", "moderate", "hold", "neutral"];

async function getH1FromURL(url) {
    try {
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
        const data = await response.json();
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.contents, "text/html");
        const h1 = doc.querySelector("h1");
        return h1 ? h1.innerText : "";
    } catch (e) {
        return "";
    }
}

function fakeSummary(text) {
    const examples = [
        "The market sentiment is shaped by recent news.",
        "Investors are cautiously optimistic.",
        "There are mixed signals from the economy.",
        "Global factors are influencing the trend."
    ];
    return examples.sort(() => 0.5 - Math.random()).slice(0, 2);
}

function basicSentiment(text) {
    text = text.toLowerCase();
    let scores = { Positive: 0, Negative: 0, Neutral: 0 };

    text.split(/\s+/).forEach(word => {
        if (positiveWords.includes(word)) scores.Positive += 1;
        else if (negativeWords.includes(word)) scores.Negative += 1;
        else if (neutralWords.includes(word)) scores.Neutral += 1;
    });

    let max = Math.max(...Object.values(scores));
    let sentiment = Object.keys(scores).filter(k => scores[k] === max);

    return sentiment.length === 1 ? sentiment[0] : sentiment[Math.floor(Math.random() * sentiment.length)];
}

document.getElementById("analyze-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    let input = document.getElementById("inputText").value.trim();
    let content = input;

    if (input.startsWith("http")) {
        content = await getH1FromURL(input);
        if (!content) content = "Unclear content from link.";
    }

    let sentiment = basicSentiment(content);

    const impactElement = document.getElementById("marketImpact");

    let message = "";
    let color = "";

    if (sentiment === "Positive") {
        message = "✅ Positive impact on Market";
        color = "#00ff88";
    } else if (sentiment === "Negative") {
        message = "🔴 Negative impact on Market";
        color = "#ff4d4d";
    } else {
        message = "🔵 Neutral impact on Market";
        color = "#0099ff";
    }

    impactElement.textContent = message;
    impactElement.style.color = color;

    const summaryList = document.getElementById("summaryList");
    summaryList.innerHTML = "";
    fakeSummary(content).forEach(point => {
        const li = document.createElement("li");
        li.textContent = point;
        summaryList.appendChild(li);
    });
});
