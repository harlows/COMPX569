const editorElements = document.querySelectorAll(".quill-editor");

editorElements.forEach((editorEl) => {
  const quill = new Quill(editorEl, {
    theme: "snow"
  });


});
