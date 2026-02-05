
 window.addEventListener("load", function () {

    const sortBy = document.querySelector("#sort-by");

    // Helper functions
    function teaser (str, len) {
        if (!str) return "";
        return str.length > len ? str.slice(0, len) + "…" : str;
    };

    function convertDate(date) {
        return new Date(date).toLocaleString("en-NZ");
    };

    sortBy.addEventListener("change", () => {
    const sortValue = sortBy.value;
    sortArticles(sortValue);
    });
    
        // Use AJAX to sort articles, then fetch an array of rows/articles
        async function sortArticles(sort) {
            const res = await fetch(`/articles?sort=${sort}`);
            const articles = await res.json();
            
            // Dynamically rebuild the DOM for each article
            const container = document.querySelector("#article-list");
            container.innerHTML = "";
            
            articles.forEach(a => {
                
                const article = document.createElement("article");
                article.classList.add("story");
                
                // Title
                const link = document.createElement("a");
                link.href = `/articles/${a.id}/read`;
                link.textContent = a.title;

                const h3 = document.createElement("h3");
                h3.classList.add("story-title");
                h3.appendChild(link);

                // Byline                
                const h4 = document.createElement("h4");
                h4.classList.add("story-byline");
                const date = convertDate(a.date);
                h4.innerText=`Posted by ${a.author} on ${date}`;
                
                // Story teaser
                const p = document.createElement("p");
                p.classList.add("story-teaser");
                p.innerHTML = teaser(a.content, 64);
                
                article.appendChild(h3);
                article.appendChild(h4);
                article.appendChild(p);
                container.appendChild(article);
            });
        };
 });