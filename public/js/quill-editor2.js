
window.addEventListener("load", function () {
  // Initialize Quill editor

  const quill = new Quill('#editor', {
      theme: 'snow'
  });

  // Add an event listener to copy Quill editor's
  // content into the hidden textarea on submission

  const form = document.querySelector("form[name='editor']");
  const hiddenContent = document.querySelector("#content");
  form.addEventListener("submit", () => {
      editorContent = quill.root.innerHTML;
      hiddenContent.value = editorContent;
  });

  // Toggle editor when the reply button is clicked
  const replyButtons = document.querySelectorAll(".btn-reply");

  replyButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const comment = btn.closest(".comment-body");
      const replyForm = comment.querySelector(".reply-form");

    replyForm.classList.toggle("hidden");
    //btn.classList.toggle("hidden");
  });
});

  
  
});