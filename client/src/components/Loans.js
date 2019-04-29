import React, { Component } from "react";
import RequestLending from "./RequestLending";
import LendMoney from "./LendMoney";
import RepayDebt from "./RepayDebt";
import CloseDebt from "./CloseDebt";
import ForceCloseDebt from "./ForceCloseDebt";

class Home extends Component {
    render() {
        return (
            <>
                <RequestLending
                  drizzleState={this.props.drizzleState}
                  drizzle={this.props.drizzle}
                />
                <LendMoney
                  drizzleState={this.props.drizzleState}
                  drizzle={this.props.drizzle}
                />
                <RepayDebt
                  drizzleState={this.props.drizzleState}
                  drizzle={this.props.drizzle}
                />
                <CloseDebt
                  drizzleState={this.props.drizzleState}
                  drizzle={this.props.drizzle}
                />
                <ForceCloseDebt
                  drizzleState={this.props.drizzleState}
                  drizzle={this.props.drizzle}
                />
            </>
        );
    }

}

export default Home;
