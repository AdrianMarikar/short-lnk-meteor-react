import React from 'react';
import { Session } from 'meteor/session';
import { Tracker } from 'meteor/tracker';

export default class LinksListFilters extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showVisible: true
    }
  }
  componentDidMount() {
    // tracker autorun
    this.showVisibleTracker = Tracker.autorun(() => {
      // Set state of checkbox
      this.setState({
        showVisible: Session.get('showVisible')
      })
    });
  }
  componentWillUnmount() {
    // cancel tracker autorun
    this.showVisibleTracker.stop(); //stops above from running on logout
  }
  render() {
    return (
      <div>
        <label className="checkbox">
          <input className="checkbox__box" type="checkbox" checked={!this.state.showVisible} onChange={(e) => {
            Session.set('showVisible', !e.target.checked);
          }}/>
          show hidden links
        </label>
      </div>
    );
  }
};
