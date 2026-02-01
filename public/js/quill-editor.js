
window.addEventListener("load", function () {
    // Initialize Quill editor

    const quill = new Quill('#editor', {
        theme: 'snow'
    });

    // Add an event listener to copy Quill editor's
    // content into the hidden textarea on submission

    const form = document.querySelector("form");
    const hiddenContent = document.querySelector("#articleContent");
    form.addEventListener("submit", () => {
        editorContent = quill.root.innerHTML;
        hiddenContent.value = editorContent;
    });
});