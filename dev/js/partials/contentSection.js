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
                (content[i+1].contentClass != "left-content" && content[i+1].contentClass != "right-content") : // check to see if next content isn't left/right float
                false) {
                    contentNodes.push(
                        React.createElement(Content, {contentClass: content[i].contentClass, contentType: content[i].contentType}, 
                            content[i].text
                            )	
                        );
                    contentNodes.push(
                        React.createElement("div", {className: "clearfix"}, 
                            null)
                        );
                } else {
                    contentNodes.push(
                        React.createElement(Content, {contentClass: content[i].contentClass, contentType: content[i].contentType}, 
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
    elementTypes: function(contentType) {
        var types = [{contentType: 'basic',htmlType: 'p'},{contentType: 'image',htmlType: 'img'}];
        for (var i = 0; i < types.length; i++) {
            if (types[i].contentType == contentType) {
                return types[i].htmlType;
            }
        }

        return null;
    },
    basic: function(props) {
        return React.createElement(props.type, props.attr, props.children);
    },
    render: function() { 
        if (this.hasOwnProperty(this.props.contentType)) {
            return (
                React.createElement("div", {className:"content-section " + this.props.contentClass}, 
                    this[this.props.contentType]({type: this.elementTypes(this.props.contentType), attr: null, children: this.props.children.toString()}) // switch content
                    )
            );
        } else {
            console.log("Content render type, " + this.props.contentType + ", does not exist.");
            return null;
        }
    }
});

// If server-side rendering (module exists), then set export
if (typeof module !== 'undefined') module.exports.ReactPartial = ContentBox;
