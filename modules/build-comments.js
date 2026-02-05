// Converts flat rows from the database query into a tree

function buildComments(comments) {
    const commentTree = {};
    const topLevelComments = [];
  
    // 1st pass: prepare each comment
    comments.forEach(function (c) {
        // Every comment can receive replies
        c.replies = [];
  
        if (!c.parent_id) {
            c.depth = 1;
        } else {
            c.depth = 2;
        };
        //Store comment by id for fast lookup
        commentTree[c.id] = c;
    });
  
    // 2nd Pass: link replies to parents
    comments.forEach(function (c) {

      if (c.parent_id) {
        // It's a reply, so find it's parent
        const parentComment = commentTree[c.parent_id];
  
        if (parentComment) {
            
            parentComment.replies.push(c);
        };
      } else {
        // It's a top level comment
        topLevelComments.push(c);
      };
    });
  
    return topLevelComments;
  };



  module.exports = { buildComments };