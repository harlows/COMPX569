
 window.addEventListener("load", function () {

    const dateBtn = document.querySelector("#sort-date")
    dateBtn.addEventListener("click", () => sortArticles("date"));

    const titleBtn = document.querySelector("#sort-title")
    titleBtn.addEventListener("click", () => sortArticles("title"));

    const nameBtn = document.querySelector("#sort-name")
    nameBtn.addEventListener("click", () => sortArticles("username"));

        async function sortArticles(sort) {
            const res = await fetch(`/articles?sort=${sort}`);
            const articles = await res.json();
            
            const container = this.document.querySelector("#article-list");
            container.innerHTML = "";
            
            articles.forEach(a => {
                
                const article = document.createElement("article");

                const h3 = document.createElement("h3");
                h3.textContent = `${a.title} by ${a.author}`;

                const p = document.createElement("p");
                p.textContent = a.content;

                article.appendChild(h3);
                article.appendChild(p);
                container.appendChild(article);
            });
        };
        
 });