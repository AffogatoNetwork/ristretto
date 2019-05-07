import React, { Component } from "react";
import Header from "./components/Header";
import "./App.css";
import { Route } from "react-router-dom";
import { withRouter } from "react-router";
import { ToastMessage } from "rimble-ui";
import Loading from "./messages/Loading";
import Home from "./components/Home";
import Endosers from "./components/Endorsers";
import Loans from "./components/Loans";
import CheckAccountChanges from "./components/CheckAccountChanges";
import Stake from "./components/Stake";
import Instructions from "./components/Instructions";
import { Alert } from "reactstrap";

class App extends Component {
  state = {
    messagesLoading: true,
    loading: true,
    drizzleState: null,
    networkId: null
  };

  componentDidMount = async () => {
    const { drizzle } = this.props;
    // subscribe to changes in the store

    this.unsubscribe = drizzle.store.subscribe(async () => {
      // every time the store updates, grab the state from drizzle
      const drizzleState = await drizzle.store.getState();

      // check to see if it's ready, if so, update local component state
      if (drizzleState.drizzleStatus.initialized) {
        this.setState({
          loading: false,
          drizzleState,
          networkId: drizzleState.web3.networkId
        });
      }
    });
  };

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    if (this.state.loading) {
      return <Loading />;
    } else {
      return (
        <>
          <CheckAccountChanges
            loggedAccount={this.state.drizzleState.accounts[0]}
            drizzle={this.props.drizzle}
            drizzleState={this.state.drizzleState}
          />
          <Header
            drizzle={this.props.drizzle}
            drizzleState={this.state.drizzleState}
            networkId={this.state.networkId}
          />
          <Route
            exact
            path="/"
            render={() => (
              <Home
                drizzle={this.props.drizzle}
                drizzleState={this.state.drizzleState}
              />
            )}
          />
          <Route
            exact
            path="/endorsers/"
            render={() => (
              <Endosers
                drizzle={this.props.drizzle}
                drizzleState={this.state.drizzleState}
              />
            )}
          />
          <Route
            exact
            path="/loans/"
            render={() => (
              <Loans
                drizzle={this.props.drizzle}
                drizzleState={this.state.drizzleState}
              />
            )}
          />
          <Route
            exact
            path="/stake/"
            render={() => (
              <Stake
                drizzle={this.props.drizzle}
                drizzleState={this.state.drizzleState}
              />
            )}
          />
          <Route exact path="/instructions/" render={() => <Instructions />} />
          <ToastMessage.Provider ref={node => (window.toastProvider = node)} />
        </>
      );
    }
  }
}

export default withRouter(App);
