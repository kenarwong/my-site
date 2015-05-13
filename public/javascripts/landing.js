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
		<div className="commentBox">
			<h3>Comments</h3>
			<CommentList data={this.state.data} />
			<CommentForm onCommentSubmit={this.handleCommentSubmit} />
		</div>
		);
	}
});

var CommentList = React.createClass({displayName: 'CommentList',
	render: function() {
		var commentNodes = this.props.data.map(function(comment) {
			 return (
				<Comment author={comment.author}>
					{comment.text}
				</Comment>	
			);
		});
		return (
		<div className="commentList">{commentNodes}</div>
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
		<div className="commentForm">
      		<form className="commentForm" onSubmit={this.handleSubmit}>
        		<input type="text" placeholder="Your name" ref="author" />
        		<input type="text" placeholder="Say something..." ref="text" />
        		<input type="submit" value="Post" />
      		</form>
		</div>
		);
	}
});

var Comment = React.createClass({displayName: 'Comment',
	render: function() { 
		return (
		<div className="comment">
			<h4 className="author">
			{this.props.author}
			</h4>
			<span>{this.props.children.toString()}</span>
		</div>
		);
	}
});

React.render(
	<CommentBox url="api/comment" pollInterval={2000} />,
	document.getElementById('content-wrapper')
);
