import React, { Component } from "react";
import RequestLending from "./RequestLending";

class Home extends Component {
    render() {
        return (
            <>
                <RequestLending
                  drizzleState={this.props.drizzleState}
                  drizzle={this.props.drizzle}
                />
            </>
        );
    }

}

export default Home;
