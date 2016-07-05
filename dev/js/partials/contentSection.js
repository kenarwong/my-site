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
        this.setState({title: response.title, header: response.header, data: response.data});
        this.props.postExec();

        // Change title
        document.title = this.state.title;

      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {title: this.props.title, header: this.props.header, data: this.props.data};
  }, 
  componentDidMount: function() {
  	this.loadContentFromServer();
  },
  render: function() {
    return (
        React.createElement("div", {ref: "content", className:"main wrapper clearfix"},
          React.createElement("h1", {className: "content-header"}, this.state.header),
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
                    React.createElement(GithubEmbed, null, null)
                    )
               );
    },
    stackoverflow: function(props) {
        return (
                React.createElement("div", {className:"content-section " + props.contentClass}, 
                    React.createElement(StackOverflowEmbed, null, null)
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
        if (twttr) twttr.widgets.load();
    },
    render: function() {
        return (
            React.createElement("div", {id:"twitter-container"}, 
                React.createElement("a", {className: "twitter-timeline", dataHeight: "300", dataTheme: "dark", href: "https://twitter.com/kenrhwang"},
                    "Tweets by kenrhwang")
                )
            );
    }
});

var GithubEmbed = React.createClass({displayName: "Github",
    componentDidMount: function() {
        console.log('github');
    },
    render: function() {
        return (
            React.createElement("div", {id:"github-container"}, 
                React.createElement("a", {className: "github-profile", href: "https://github.com/kennyhwang"},
                    null)
                )
            );
    }
});

var StackOverflowEmbed = React.createClass({displayName: "StackOverflow",
    componentDidMount: function() {
        console.log('stack overflow');
    },
    render: function() {
        return (
            React.createElement("div", {id:"stackoverflow-container"}, 
                React.createElement("a", {className: "stackoverflow-profile", href: "http://stackoverflow.com/users/2855317/ken-hwang"},
                    React.createElement("img", {src: "http://stackoverflow.com/users/flair/2855317.png?theme=dark", width: "208", height:"58", alt:"Profile for Ken Hwang at Stack Overflow", title:"Profile for Ken Hwang at Stack Overflow"},
                        null
                        )
                    )
                )
            );
    }
});

// If server-side rendering (module exists), then set export
if (typeof module !== 'undefined') module.exports.ReactPartial = ContentBox;
