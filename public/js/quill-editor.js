
window.addEventListener("load", function () {
  

  // Find every form that needs a Quill editor
  const forms = document.querySelectorAll(".quill-form");

  forms.forEach( (form) => {
    const editor = form.querySelector(".quill-editor");
    const hiddenContent = form.querySelector(".quill-content");

    // Initialize Quill editor in this form
    const quill = new Quill(editor, {
        theme: 'snow'
    });

    // Add an event listener to copy Quill editor's
    // content into the hidden textarea on submission

    form.addEventListener("submit", () => {
        editorContent = quill.root.innerHTML;
        hiddenContent.value = editorContent;
    });
  });

  // Toggle editor when the reply button is clicked
  const replyButtons = document.querySelectorAll(".btn-reply");

  replyButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const comment = btn.closest(".comment");
      const replyForm = comment.querySelector(".reply-form");

    replyForm.classList.toggle("hidden");
  });
});

  // Toggle comment section visibility
  const hideCommentsBtn = document.querySelector("#toggle-comments");
  const comments = this.document.querySelector("#comments");

  hideCommentsBtn.addEventListener("click", () => {
      //comments.classList.toggle("hidden");
      if (comments.classList.contains("hidden")) {
        hideCommentsBtn.textContent = "Show comments";
      } else
        hideCommentsBtn.textContent = "Hide comments";
  });



});