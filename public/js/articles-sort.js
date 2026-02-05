
 window.addEventListener("load", function () {

    const sortBy = document.querySelector("#sort-by");

    sortBy.addEventListener("change", () => {
    const sortValue = sortBy.value;
    console.log(sortValue);
    sortArticles(sortValue);
    });
    
        // Use AJAX to sort articles, then...
        async function sortArticles(sort) {
            const res = await fetch(`/articles?sort=${sort}`);
            const articles = await res.json();
            // Dynamically rebuild the DOM for each article
            const container = this.document.querySelector("#article-list");
            container.innerHTML = "";
            
            articles.forEach(a => {
                
                const article = document.createElement("article");
                article.classList.add("story");

                const link = document.createElement("a");
                link.href = `/articles/${a.id}/read`;
                link.textContent = a.title;

                const h3 = document.createElement("h3");
                h3.classList.add("story-title");
                h3.appendChild(link);
                h3.appendChild(document.createTextNode(` by ${a.author}`));
                
                const p = document.createElement("p");
                p.innerHTML = a.content;
                
                article.appendChild(h3);
                article.appendChild(p);
                container.appendChild(article);
            });
        };
        
 });