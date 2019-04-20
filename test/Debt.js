require("chai").should();
require("chai").expect;
var BN = web3.utils.BN;
require("chai").use(require("chai-bignumber")(BN));
const Debt = artifacts.require("./Debt.sol");

contract("Debt", accounts => {
  beforeEach(async () => {
    this.debtInstance = await Debt.deployed();
  });

  it("...should stake money.", async () => {
    const initialBalance = await web3.eth.getBalance(accounts[1]);
    const receipt = await this.debtInstance.stakeMoney({
      from: accounts[1],
      value: web3.utils.toWei("1", "ether")
    });
    receipt.logs.length.should.be.equal(1, "trigger one event");
    receipt.logs[0].event.should.be.equal(
      "LogStakeMoney",
      "should be the LogStakeMoney event"
    );
    receipt.logs[0].args._staker.should.be.equal(
      accounts[1],
      "logs the staker address"
    );
    web3.utils
      .fromWei(receipt.logs[0].args._amount, "wei")
      .should.be.equal(
        web3.utils.toWei("1", "ether"),
        "logs the staked amount"
      );
    const finalBalance = await web3.eth.getBalance(accounts[1]);
    let amountStaked = await this.debtInstance.getStakedAmount({
      from: accounts[1]
    });
    web3.utils
      .fromWei(amountStaked, "wei")
      .should.be.equal(
        web3.utils.toWei("1", "ether"),
        "Stake should be the same as deposit"
      );
    Number(finalBalance).should.be.below(Number(initialBalance));
  });

  it("...should retrieve stake.", async () => {
    const initialBalance = await web3.eth.getBalance(accounts[1]);
    const amount = web3.utils.toWei("1", "ether");
    const receipt = await this.debtInstance.withdrawStakeMoney(amount, {
      from: accounts[1]
    });
    receipt.logs.length.should.be.equal(1, "trigger one event");
    receipt.logs[0].event.should.be.equal(
      "LogWithdrawStakeMoney",
      "should be the LogWithdrawStakeMoney event"
    );
    receipt.logs[0].args._staker.should.be.equal(
      accounts[1],
      "logs the staker address"
    );
    web3.utils
      .fromWei(receipt.logs[0].args._amount, "wei")
      .should.be.equal(
        web3.utils.toWei("1", "ether"),
        "logs the withdraw amount"
      );
    const finalBalance = await web3.eth.getBalance(accounts[1]);
    let amountStaked = await this.debtInstance.getStakedAmount({
      from: accounts[1]
    });
    web3.utils
      .fromWei(amountStaked, "wei")
      .should.be.equal(web3.utils.toWei("0", "ether"), "stake should be 0");
    Number(finalBalance).should.be.above(Number(initialBalance));
  });
});
