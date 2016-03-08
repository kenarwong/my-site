// If client-side, ignore require statement, otherwise
// Supply react library for server-side rendering
var React = React || require('react/addons');

var ContentBox = React.createClass({displayName: 'ContentBox',
  loadContentFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(response) {
        this.setState({title: response.title, data: response.data});
        this.props.postExec();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {title: this.props.title, data: this.props.data};
  }, 
  componentDidMount: function() {
  	this.loadContentFromServer();
  },
  render: function() {
    return (
        React.createElement("div", {ref: "content", className:"main wrapper clearfix"},
          React.createElement("h1", null, this.state.title),
          React.createElement(ContentWrapper, {data: this.state.data})
          )
        );
  }
});

var ContentWrapper = React.createClass({displayName: 'ContentWrapper',
	render: function() {
		var contentNodes = this.props.data.map(function(content) {
			 return (
				React.createElement(Content, {identifier: content.id}, 
					content.text
				)	
			);
		});
		return (
		React.createElement("div", {className: "content-wrapper"}, contentNodes)
		);
	}
});

var Content = React.createClass({displayName: 'Content',
  render: function() { 
    return (
        React.createElement("div", {id: this.props.identifier}, 
          React.createElement("p", null, this.props.children.toString())
        )
        );
  }
});

// If server-side rendering (module exists), then set export
if (typeof module !== 'undefined') module.exports.ReactPartial = ContentBox;
