import React, { Component } from "react";
import { Alert, Nav, NavItem } from "reactstrap";
import Blockies from "react-blockies";
import { Link, Icon } from "rimble-ui";

class Header extends Component {
  constructor(props) {
    super(props);
    const { drizzle, drizzleState } = this.props;
    this.state = {
      account: drizzleState.accounts[0],
      hasBalance: false,
      balance: 0,
      stake: 0,
      visible: true
    };

    this.onDismiss = this.onDismiss.bind(this);
  }

  componentDidMount() {
    const { drizzle } = this.props;
    this.hasBalance(drizzle);
    this.loadStake(drizzle);
  }

  onDismiss() {
    this.setState({ visible: false });
  }

  async hasBalance(drizzle) {
    var balance = await drizzle.web3.eth.getBalance(this.state.account);
    balance = drizzle.web3.utils.fromWei(balance, "ether");
    var hasBalance = balance > 0 ? true : false;
    this.setState({ hasBalance, balance });
  }

  async loadStake(drizzle) {
    var stake = await drizzle.contracts.Debt.methods
      .getStakedAmount(this.state.account)
      .call();
    stake = drizzle.web3.utils.fromWei(stake, "ether");
    this.setState({ stake: stake });
  }

  render() {
    const { networkId } = this.props;
    let money = "";
    console.log(networkId);
    switch (networkId) {
      case 100:
        money = "xDAI";
        break;
      case 99:
        money = "POA";
        break;
      case 77:
        money = "SPOA";
        break;
      default:
        money = "ETH";
        break;
    }
    return (
      <>
        <Alert
          color="warning"
          isOpen={this.state.visible}
          toggle={this.onDismiss}
        >
          ⚠️ This is a non audited Hackathon Demo! We recommend to use it on{" "}
          <b>Rinkeby</b> or <b>Sokol POA</b> Testnets. This project was
          developed by the{" "}
          <Link href="https://affogato.co" color="secondary" target="_blank">
            <b>Affogato Team</b>
          </Link>
          .
        </Alert>
        <Nav className="mt-4 justify-content-end">
          <NavItem className="ml-2 mr-4 mt-4 pt-1 text-left ">
            <Link href="/" color="secondary">
              <span>
                <Icon name="Home" size="20" className="mr-1" />
                Home
              </span>
            </Link>
          </NavItem>
          <NavItem className="ml-2 mr-4 mt-4 pt-1 text-left ">
            <Link href="/loans/" color="secondary">
              <span>
                <Icon name="AccountBalance" size="20" className="mr-1" />
                Debts
              </span>
            </Link>
          </NavItem>
          <NavItem className="ml-2 mr-4 mt-4 pt-1 text-left ">
            <Link href="/endorsers/" color="secondary">
              <span>
                <Icon name="People" size="20" className="mr-1" />
                Endorsers
              </span>
            </Link>
          </NavItem>
          <NavItem className="ml-2 mr-4 mt-4 pt-1 text-left ">
            <Link href="/stake/" color="secondary">
              <Icon name="Lock" size="20" className="mr-1" />
              Stake: {this.state.stake} {money}
            </Link>
          </NavItem>
          <NavItem className="ml-2 mr-4 mt-4 pt-1 text-left ">
            <Link href="/instructions/" color="secondary">
              <Icon name="Help" size="20" className="mr-1" />
              Help
            </Link>
          </NavItem>
          <NavItem className="ml-2 mr-4 mt-4 pt-1 text-left ">
            <Icon
              name="AccountBalanceWallet"
              size="20"
              className="mr-1"
              color="primary"
            />
            Balance: {this.state.balance} {money}
          </NavItem>
          <NavItem className="ml-2 mt-1 text-right">
            <b>Current Account:</b> <br />
            <label>{this.state.account}</label>
          </NavItem>
          <NavItem className="ml-2 mr-4">
            <Blockies seed={this.state.account} size={10} scale={5} />
          </NavItem>
        </Nav>
      </>
    );
  }
}

export default Header;
