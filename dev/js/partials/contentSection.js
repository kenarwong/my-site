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

        // Apply centerfix if followed by a section that isn't floating
        var classRegex = new RegExp(/left-content|right-content/);
        for (var i = 0; i < content.length; i++) {
            if (!(i+1 >= content.length) ?  // if iterator isn't longer than array
                (content[i+1].contentClass.match(classRegex) == null) : // check to see if next content isn't left/right float
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
    basic: function(props) {
        return ( 
            React.createElement("div", {className:"content-section " + props.contentClass}, 
                React.createElement('p', null, props.children.toString())
                )
            );
    },
    image: function(props) {
        return (
            React.createElement("div", {className:"content-section image " + props.contentClass}, 
                React.createElement("div", null, null)
                )
            );
    },
    downloadresume: function(props) {
        return (
            React.createElement("div", {className:"content-section resume " + props.contentClass}, 
                React.createElement("span", null, "Download "),
                React.createElement("a", {href: "/api/resume/download"}, "here"),
                React.createElement("span", null, ".")
                )
            );
    },
    embedresume: function(props) {
        return (
            React.createElement("div", {className:"content-section resume " + props.contentClass}, 
                React.createElement("embed", {src: "/build/files/resume.pdf", height: "800px", width: "100%"}, null)
                )
            );
    },
    twitter: function(props) {
        return (
                React.createElement("div", {className:"content-section " + props.contentClass}, 
                    React.createElement(TwitterEmbed, null, null)
                    )
               );
    },
    github: function(props) {
        return (
                React.createElement("div", {className:"content-section " + props.contentClass}, 
                    null
                    )
               );
    },
    stackoverflow: function(props) {
        return (
                React.createElement("div", {className:"content-section " + props.contentClass}, 
                    null
                    )
               );
    },
    render: function() { 
        if (this.hasOwnProperty(this.props.contentType)) {
            return (
                    this[this.props.contentType](this.props) // switch content
                    );
        } else {
            console.log("Content render type, " + this.props.contentType + ", does not exist.");
            return null;
        }
    }
});

var TwitterEmbed = React.createClass({displayName: "Twitter", 
    componentDidMount: function() {
        var embedCode = "<script async src='//platform.twitter.com/widgets.js' charset='utf-8'></script>";
        var twtrContainer = document.getElementById("twitter-container");
        twtrContainer.innerHTML += embedCode;
    },
    render: function() {
        return (
            React.createElement("div", {id:"twitter-container"}, 
                React.createElement("a", {className: "twitter-timeline", dataHeight: "300", href: "https://twitter.com/kenrhwang"},
                    "Tweets by kenrhwang")
                )
            );
    }
});

// If server-side rendering (module exists), then set export
if (typeof module !== 'undefined') module.exports.ReactPartial = ContentBox;
