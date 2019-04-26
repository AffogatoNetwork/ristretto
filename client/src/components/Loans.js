import React, { Component } from "react";
import RequestLending from "./RequestLending";
import LendMoney from "./LendMoney";
import RepayDebt from "./RepayDebt";
import Debts from "./Debts";

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
            </>
        );
    }

}

export default Home;
