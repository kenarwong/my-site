// If client-side, ignore require statement, otherwise
// Supply react library for server-side rendering
var React = React || require('react');
//var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

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
          React.createElement("h1", {className: "content-header"}, this.state.title),
          React.createElement(ContentWrapper, {data: this.state.data})
          )
        );
  }
});

var ContentWrapper = React.createClass({displayName: 'ContentWrapper',
	render: function() {
        var content = this.props.data;
        var contentNodes = [];
        for (var i = 0; i < content.length; i++) {
            if (!(i+1 >= content.length) ?  // if iterator isn't longer than array
                (content[i+1].id != "left-content" && content[i+1].id != "right-content") : // check to see if next content isn't left/right float
                false) {
                    contentNodes.push(
                        React.createElement(Content, {identifier: content[i].id}, 
                            content[i].text
                            )	
                        );
                    contentNodes.push(
                        React.createElement("div", {className: "clearfix"}, 
                            null)
                        );
                } else {
                    contentNodes.push(
                        React.createElement(Content, {identifier: content[i].id}, 
                            content[i].text
                            )	
                        );
                }
        }
        return (
                React.createElement("div", {className: "content-wrapper"}, contentNodes)
               );
	}
});

var Content = React.createClass({displayName: 'Content',
  render: function() { 
    return (
        React.createElement("div", {id: this.props.identifier, className:"content-section"}, 
          React.createElement("p", null, this.props.children.toString())
        )
        );
  }
});

// If server-side rendering (module exists), then set export
if (typeof module !== 'undefined') module.exports.ReactPartial = ContentBox;
