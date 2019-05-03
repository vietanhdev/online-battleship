import React from 'react';
import PropTypes from 'prop-types';

export default class Alert extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  dismiss() {
    this.setState({
      dismissed: true
    });
  }

  renderError() {
    let errorMessage;
    if (typeof this.props.error === "string") {
      errorMessage = this.props.error;
    } else {
      errorMessage = this.props.error.errorMessage || this.props.error.message;
    }

    return (
      <div>
        <div><strong>{errorMessage}</strong></div>
        {this.props.error.code ? <div>{this.props.error.code}</div> : null}
      </div>
    );
  }

  render() {
    if (this.state.dismissed === true) return null;

    const children = this.props.error ? this.renderError() : this.props.children;

    return (
      <div className={`alert alert-${this.props.error ? 'danger' : this.props.type}`}>
        {
          (() => {
            if (this.props.dismissable !== true) return null;

            return (
              <button type="button" className="close" onClick={this.dismiss.bind(this)}>
                <span aria-hidden="true">×</span>
                <span className="sr-only">Close</span>
              </button>
            );
          })()
        }
        <div>
          {children}
        </div>
      </div>
    );
  }
}

Alert.propTypes = {
  children: PropTypes.any,
  dismissable: PropTypes.bool,
  error: PropTypes.any,
  debug: PropTypes.bool,
  type: PropTypes.oneOf(['success', 'warning', 'danger', 'info'])
};

Alert.defaultProps = {
  dismissable: false,
  type: 'info',
  debug: false
};