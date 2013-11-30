/** @jsx React.DOM */
var GamedayFrame = React.createClass({
  loadDataFromServer: function() {
    $.ajax({
      url: this.props.url,
      success: function(events) {
        this.setState({events: events});
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {
      chatEnabled: false,
      events: [],
      displayedEvents: []
    };
  },
  componentWillMount: function() {
    //this.loadDataFromServer();
    //setInterval(this.loadDataFromServer, this.props.pollInterval);
    this.setState({events: this.props.events})
  },
  render: function() {
    return (
      <div className="gameday container-full">
        <GamedayNavbar 
          chatEnabled={this.state.chatEnabled}
          events={this.state.events}
          onChatToggle={this.handleChatToggle}
          onWebcastAdd={this.handleWebcastAdd}
          onWebcastReset={this.handleWebcastReset} />
        <VideoGrid 
          events={this.state.displayedEvents}
          rightPanelEnabled={this.state.chatEnabled} />
        <ChatPanel enabled={this.state.chatEnabled} />
      </div>
    );
  },
  handleChatToggle: function() {
    this.setState({chatEnabled: !this.state.chatEnabled});
    console.log(this.state.chatEnabled);
    console.log('click!');
  },
  handleWebcastAdd: function(eventModel) {
    var displayedEvents = this.state.displayedEvents;
    var newDisplayedEvents = displayedEvents.concat([eventModel]);
    this.setState({displayedEvents: newDisplayedEvents});
  },
  handleWebcastReset: function() {
    this.setState({displayedEvents: []});
  }
});

var GamedayNavbar = React.createClass({
  render: function() {
    return (
      <nav className="navbar navbar-default navbar-fixed-top" role="navigation">
        <div className="navbar-header">
          <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <a className="navbar-brand" href="#">Gameday</a>
        </div>

        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul className="nav navbar-nav navbar-right">
            <li className="dropdown">
              <a href="#" className="dropdown-toggle" data-toggle="dropdown">Layouts <b className="caret"></b></a>
              <ul className="dropdown-menu">
                <li><a href="#">First</a></li>
                <li><a href="#">Second</a></li>
                <li><a href="#">Third</a></li>
                <li className="divider"></li>
                <li><a href="#">Separated link</a></li>
              </ul>
            </li>
            <WebcastDropdown
              events={this.props.events}
              onWebcastAdd={this.props.onWebcastAdd}
              onWebcastReset={this.props.onWebcastReset} />
            <li>
              <BootstrapButton
                active={this.props.chatEnabled}
                handleClick={this.props.onChatToggle}>Chat</BootstrapButton>
            </li>
            <li><a href="#" className="btn btn-default">Hashtags</a></li>
            <li><a href="#">Settings</a></li>
          </ul>
        </div>
      </nav>
    );
  }
});

var ChatPanel = React.createClass({
  render: function() {
    var cx = React.addons.classSet;
    var classes = cx({
      'chatPanel': true,
      'hidden': !this.props.enabled,
    });
    return (
      <div className={classes}>
        <div id="chat-info-background">
          <div id="chat-info" className="alert alert-warning"><button type="button" className="close" data-dismiss="alert">&times;</button><strong>Reminder:</strong> You need to log into a <a href="http://www.justin.tv" target="_blank">Justin.tv</a> or <a href="http://www.twitch.tv" target="_blank">Twitch.tv</a> account in order to chat.</div>
        </div>
        <iframe frameBorder="0" scrolling="no" id="chat_embed" src="http://twitch.tv/chat/embed?channel=tbagameday&amp;popout_chat=true" height="100%" width="100%"></iframe>
      </div>
    );
  }
})

var BootstrapButton = React.createClass({
  componentWillMount: function() {
    if (!this.props.a) {
      this.props.a = "#";
    }
  },
  handleClick: function() {
    if (this.props.handleClick) {
      this.props.handleClick();
      return false;
    }
  },
  render: function() {
    var cx = React.addons.classSet;
    var classes = cx({
      'btn': true,
      'btn-default': true,
      'active': this.props.active,
    });
    return (
      <a className={classes} href={this.props.a} onClick={this.handleClick}>{this.props.children}</a>
    );
  }
});

var VideoGrid = React.createClass({
  render: function() {
    var cx = React.addons.classSet;
    var classes = cx({
      'videoGrid': true,
      'leaveRightMargin': this.props.rightPanelEnabled,
    });
    switch (this.props.events.length) {
      case 0:
        var layout = <VideoCellLayoutZero />
        break;
      case 1:
        var layout = <VideoCellLayoutOne events={this.props.events} />
        break;
      case 2:
        var layout = <VideoCellLayoutTwo events={this.props.events} />
        break;
      case 3:
        var layout = <VideoCellLayoutThree events={this.props.events} />
        break;
    }
    return (
      <div className={classes}>
        {layout}
      </div>
    );
  },
});

var VideoCellLayoutZero = React.createClass({
  render: function() {
    return (
        <div className="row">
          <div className="col-md-12">      
            <p>No Videos!</p>
          </div>
        </div>
      );
  }
});

var VideoCellLayoutOne = React.createClass({
  render: function() {
    if (this.props.events) {
      var eventModel = this.props.events[0];
    } else {
      var eventModel = null;
    }
    return (
        <div className="row">
          <div className="col-md-12">      
            <VideoCell
              eventModel={eventModel}
              vidHeight="100%"
              vidWidth="100%" />
          </div>
        </div>
      );
  }
});

var VideoCellLayoutTwo = React.createClass({
  render: function() {
    return (
        <div className="row">
          <div className="col-md-6">
            <VideoCell
              eventModel={this.props.events[0]}
              vidHeight="100%"
              vidWidth="100%" />
          </div>
          <div className="col-md-6">
            <VideoCell
              eventModel={this.props.events[1]}
              vidHeight="100%"
              vidWidth="100%" />
          </div>
        </div>
      );
  }
});

var VideoCellLayoutThree = React.createClass({
  render: function() {
    return (
        <div className="row">
          <div className="col-md-6">
            <VideoCell
              eventModel={this.props.events[0]}
              vidHeight="100%"
              vidWidth="100%" />
          </div>
          <div className="col-md-6">
            <div className="row">
              <div className="col-md-12">
                <VideoCell
                  eventModel={this.props.events[1]}
                  vidHeight="50%"
                  vidWidth="100%" />
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <VideoCell
                  eventModel={this.props.events[2]}
                  vidHeight="50%"
                  vidWidth="100%" />
              </div>
            </div>
          </div>
        </div>
      );
  }
});

var VideoCell = React.createClass({
  render: function() {
    if (this.props.eventModel) {
      if (this.props.eventModel.webcasts) {
        var src = "//www.youtube.com/embed/" + this.props.eventModel.webcasts[0].channel;
        var id = this.props.eventModel.name + "-1";
      }
    } else {
      var src = "";
      var id = "blank";
    }
    
    return (
      <div className="videoCell" idName={id}>
        <iframe width={this.props.vidWidth} height={this.props.vidHeight} src={src} frameBorder="0" allowFullScreen></iframe>
      </div>
    );
  }
});

var WebcastDropdown = React.createClass({
  render: function() {
    var webcastListItems = [];
    for (var index in this.props.events) {
      webcastListItems.push(<WebcastListItem eventModel={this.props.events[index]} onWebcastAdd={this.props.onWebcastAdd} />)
    };
    return (
      <li className="dropdown">
        <a href="#" className="dropdown-toggle" data-toggle="dropdown">Webcasts <b className="caret"></b></a>
        <ul className="dropdown-menu">
          {webcastListItems}
          <li className="divider"></li>
          <BootstrapNavDropdownListItem handleClick={this.props.onWebcastReset}>Reset Webcasts</BootstrapNavDropdownListItem>
        </ul>
      </li>
    );    
  }
})

var WebcastListItem = React.createClass({
  handleClick: function() {
    this.props.onWebcastAdd(this.props.eventModel);
  },
  render: function() {
    return <BootstrapNavDropdownListItem handleClick={this.handleClick}>{this.props.eventModel.name}</BootstrapNavDropdownListItem>
  },
})

var BootstrapNavDropdownListItem = React.createClass({
  componentWillMount: function() {
    if (!this.props.a) {
      this.props.a = "#";
    }
  },
  handleClick: function() {
    if (this.props.handleClick) {
      this.props.handleClick();
      return false;
    }
  },
  render: function() {
    return (
      <li><a href="{this.props.a}" onClick={this.handleClick}>{this.props.children}</a></li>
    )
  },
})

var events = [
  {"key": "2014nh", "name": "BAE Granite State", "webcasts": [{"type": "youtube", "channel": "olhwB5grOtA"}]},
  {"key": "2014ct", "name": "UTC Regional", "webcasts": [{"type": "youtube", "channel": "FKpIWmsDPq4"}]},
  {"key": "2014az", "name": "Arizona!", "webcasts": [{"type": "youtube", "channel": "QZv70PG9eXM"}]}
]

React.renderComponent(
  <GamedayFrame events={events} pollInterval={20000} />,
  document.getElementById('content')
);