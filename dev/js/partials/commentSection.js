$(document).ready(function() {
  React.render(
      React.createElement(CommentBox, {url: "api/comment"}), //pollInterval={2000}
      document.getElementById('comment-box')
      );
});

var CommentBox = React.createClass({displayName: 'CommentBox',
  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleCommentSubmit: function(comment) {
    var comments = this.state.data;

    // Optimistic render
    var newComments = comments.concat([comment]);
    this.setState({data: newComments});

    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function(response) {
        this.setState({data: response});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },	
  getInitialState: function() {
    return {data: []};
  }, 
  componentDidMount: function() {
    this.loadCommentsFromServer();
    // setInterval(this.loadCommentsFromServer,this.props.pollInterval);
  },
  render: function() {
    return (
        React.createElement("div", {className: "commentBox"}, 
        React.createElement("h3", null, "Leave Your Thoughts"), 
        React.createElement(CommentForm, {onCommentSubmit: this.handleCommentSubmit}), 
        React.createElement(CommentList, {data: this.state.data})
        )
        );
  }
});

var CommentList = React.createClass({displayName: 'CommentList',
  render: function() {
    var commentNodes = this.props.data.map(function(comment) {
      return (
          React.createElement(Comment, {author: comment.author}, 
          comment.text
          )	
          );
    });
    return (
        React.createElement("div", {className: "commentList"}, commentNodes)
        );
  }
});

var CommentForm = React.createClass({displayName: 'CommentForm',
  handleSubmit: function(e) {
    e.preventDefault();
    var author = this.refs.author.getDOMNode().value.trim();
    var text = this.refs.text.getDOMNode().value.trim();
    if (!text || !author) {
      return;
    }
    this.props.onCommentSubmit({author: author, text: text}); 
    this.refs.author.getDOMNode().value = '';
    this.refs.text.getDOMNode().value = '';
  },
    render: function() {
        return (
            React.createElement("div", {className: "commentForm"}, 
                React.createElement("form", {className: "commentForm", onSubmit: this.handleSubmit}, 
                    React.createElement("span", {className: "input-span"}, 
                        React.createElement("input", {type: "text", id: "comment-name", placeholder: "Your name", ref: "author", className: "balloon", maxlength: "100"}), 
                        React.createElement("label", {htmlFor: "comment-name"},"Name")
                        ),
                    React.createElement("span", {className: "input-span"}, 
                        React.createElement("textarea", {type: "text", id: "comment-text", placeholder: "Say something...", ref: "text", className: "balloon", rows: "5", maxlength: "250"}), 
                        React.createElement("label", {htmlFor: "comment-text"},"Comment")
                        ),
                    React.createElement("span", {className: "submit-span"}, 
                        React.createElement("button", {type: "submit"},
                            React.createElement("span", null, "Submit")
                            )
                        )
                    )
                )
            );
    }
});

var Comment = React.createClass({displayName: 'Comment',
  render: function() { 
    return (
        React.createElement("div", {className: "comment"}, 
        React.createElement("h4", {className: "author"}, 
        this.props.author
        ), 
        React.createElement("span", null, this.props.children.toString())
        )
        );
  }
});
