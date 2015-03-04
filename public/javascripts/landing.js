var CommentBox = React.createClass({
	render: function() {
		return (
			<div className="commentBox">
				<span>1</span>
			</div>
			);
	}
});

React.render(
	<CommentBox />,
	document.getElementById('content-wrapper')
);
