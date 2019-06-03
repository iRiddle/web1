import React, { Component } from "react";
import { connect } from "react-redux";
import history from "../../utils/history";

export default function(ComposedComponent) {
  class Authentication extends Component {
    componentWillMount() {
      if (!this.props.user) {
        history.push("/");
      }
    }

    componentWillUpdate(nextProps) {
      if (!nextProps.user) {
        history.push("/");
      }
    }

    render() {
      if (!this.props.user) {
        return <div />;
      }
      return <ComposedComponent {...this.props} />;
    }
  }

  function mapStateToProps(state) {
    return {
      user: state.auth.user
    };
  }

  return connect(mapStateToProps)(Authentication);
}
