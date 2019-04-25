import React, { Component } from "react";
import StakeMoney from "./StakeMoney";
import WithdrawStakeMoney from "./WithdrawStakeMoney";
import EndorseUser from "./EndorseUser";
import DeclineEndorsement from "./DeclineEndorsement";


class Home extends Component {
    render() {
        return (
            <>
                <StakeMoney
                  drizzleState={this.props.drizzleState}
                  drizzle={this.props.drizzle}
                />
                <WithdrawStakeMoney
                  drizzleState={this.props.drizzleState}
                  drizzle={this.props.drizzle}
                />
                <EndorseUser
                  drizzleState={this.props.drizzleState}
                  drizzle={this.props.drizzle}
                />
                <DeclineEndorsement
                  drizzleState={this.props.drizzleState}
                  drizzle={this.props.drizzle}
                />
            </>
        );
    }

}

export default Home;
