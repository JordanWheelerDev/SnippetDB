document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search-input");
    const suggestionsContainer = document.getElementById("suggestions");
    const selectLang = document.getElementById("select-lang");

    // Function to fetch code snippets based on the selected language
    function fetchSnippets(language) {
        return fetch(`langs/${language}.json`)
            .then((response) => response.json())
            .catch((error) =>
                console.error(`Error fetching ${language} code snippets:`, error)
            );
    }

    searchInput.addEventListener("input", () => {
        search();
    });

    function search() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedLanguage = selectLang.value;
    
        // Fetch code snippets based on the selected language
        fetchSnippets(selectedLanguage)
            .then((data) => {
                const matchingSnippets = data.filter((snippet) => {
                    const searchContent =
                        `${snippet.language} ${snippet.question} ${snippet.code} ${snippet.explanation}`.toLowerCase();
                    return searchContent.includes(searchTerm);
                });
    
                // Clear previous suggestions
                suggestionsContainer.innerHTML = "";
    
                // Display suggestions (limited to 10)
                matchingSnippets.slice(0, 10).forEach((snippet) => {
                    const suggestionElement = document.createElement("div");
                    suggestionElement.textContent = snippet.question;
                    suggestionElement.classList.add("suggestion-link");
                    suggestionElement.addEventListener("click", () => {
                        displayCodeSnippet(snippet);
                        searchInput.value = "";
                        suggestionsContainer.innerHTML = "";
                    });
                    suggestionsContainer.appendChild(suggestionElement);
                });
            })
            .catch((error) => {
                console.error("Error fetching code snippets:", error);
            });
    }
    

    function displayCodeSnippet(snippet) {
        const selectedLanguageCss = document.getElementById("select-lang").value.toLowerCase();
        const snippetList = document.getElementById("snippet-list");
        const snippetElement = document.createElement("div");
        const questionContent = (snippet.language === 'HTML') ? escapeHTML(snippet.question) : snippet.question;
        const explanationContent = (snippet.language === 'HTML') ? escapeHTML(snippet.explanation) : snippet.explanation;
        const codeContent = (snippet.language === 'HTML') ? escapeHTML(snippet.code) : snippet.code;
        snippetElement.innerHTML = `
            <h3>${snippet.language}</h3>
            <p><strong>Question:</strong> ${questionContent}</p>
            <pre class="${selectedLanguageCss}"><code>${codeContent}</code></pre>
            <p><strong>Explanation:</strong> ${explanationContent}</p>
        `;
        snippetList.innerHTML = ""; // Clear previous snippet
        snippetList.appendChild(snippetElement);
    }

    // Function to escape HTML tags
    function escapeHTML(html) {
        return html.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    selectLang.addEventListener("change", function() {
        const selectedLanguage = selectLang.value.toLowerCase();
        switch (selectedLanguage) {
          case "javascript":
            searchInput.placeholder = "How to create a function in JavaScript?";
            break;
          case "html":
            searchInput.placeholder = "How to represent subscript text in HTML?";
            break;
        case "python":
            searchInput.placeholder = "What are dictionaries in Python?";
            break;
        case "react":
            searchInput.placeholder = "What is useReducer() hook in React?";
            break;
          default:
            searchInput.placeholder = "Enter your search query";
        }
      });
});
