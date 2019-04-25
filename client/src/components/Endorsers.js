import React, { Component } from "react";
import StakeMoney from "./StakeMoney";
import WithdrawStakeMoney from "./WithdrawStakeMoney";
import EndorseUser from "./EndorseUser";
import { Container, Col, Row, Form, FormGroup } from "reactstrap";
import { Heading } from "rimble-ui";


class Endorsers extends Component {

    constructor(props) {
        super(props);
        const { drizzle, drizzleState } = this.props;

        this.state = {
          account: drizzleState.accounts[0],
          endorsers: "",
          status: "initialized",
          modal: false,
          transactionHash: "",
          modalSuccess: true,
          modalPending: true,
          modalBody: "",
          modalTitle: ""
        };

        this.contracts = props.drizzle.contracts;
        this.drizzle = props.drizzle;
        this.web3 = props.drizzle.web3;
    }

    componentDidMount() {
        const { drizzle } = this.props;
        this.loadEndorsers(drizzle);
    }

    async loadEndorsers(drizzle){
        var endorsers = await drizzle.contracts.Debt.methods.getUserEndorsers(this.state.account).call();
        this.setState({ endorsers: endorsers });
    }

    createList = () => {
        let list = []

        for (let i = 0; i < this.state.endorsers.length; i++) {
          list.push(<Heading.h4>
            {
                this.state.endorsers[i]
            }
          </Heading.h4>)
        }

        return list;
    }


    render() {
        return (
            <>
              <Container className="mt-4">
                <Row className="justify-content-center">
                    {this.createList() }
                </Row>
              </Container>
            </>
        );
    }

}

export default Endorsers;