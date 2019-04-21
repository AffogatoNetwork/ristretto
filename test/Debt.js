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
    let initialAvailable = await this.debtInstance.availableToEndorse(
      accounts[1]
    );
    Number(initialAvailable).should.equal(0);
    const initialBalance = await web3.eth.getBalance(accounts[1]);
    const receipt = await this.debtInstance.stakeMoney({
      from: accounts[1],
      value: web3.utils.toWei("2", "ether")
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
        web3.utils.toWei("2", "ether"),
        "logs the staked amount"
      );
    const finalBalance = await web3.eth.getBalance(accounts[1]);
    let amountStaked = await this.debtInstance.getStakedAmount({
      from: accounts[1]
    });
    web3.utils
      .fromWei(amountStaked, "wei")
      .should.be.equal(
        web3.utils.toWei("2", "ether"),
        "Stake should be the same as deposit"
      );
    Number(finalBalance).should.be.below(Number(initialBalance));
    let finalAvailable = await this.debtInstance.availableToEndorse(
      accounts[1]
    );
    web3.utils
      .fromWei(finalAvailable, "wei")
      .should.be.equal(
        web3.utils.toWei("2", "ether"),
        "Should be same as deposit"
      );
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
      .should.be.equal(web3.utils.toWei("1", "ether"), "stake should be 1");
    Number(finalBalance).should.be.above(Number(initialBalance));
    let availableToEndorse = await this.debtInstance.availableToEndorse(
      accounts[1]
    );
    web3.utils
      .fromWei(availableToEndorse, "wei")
      .should.be.equal(web3.utils.toWei("1", "ether"), "stake should be 1");
  });

  it("... should allows staker to endorse user", async () => {
    const amount = web3.utils.toWei("1", "ether");
    const receipt = await this.debtInstance.endorseUser(accounts[2], amount, {
      from: accounts[1]
    });
    receipt.logs.length.should.be.equal(1, "trigger one event");
    receipt.logs[0].event.should.be.equal(
      "LogEndorse",
      "should be the LogEndorses event"
    );
    receipt.logs[0].args._staker.should.be.equal(
      accounts[1],
      "logs the staker address"
    );
    receipt.logs[0].args._endorsed.should.be.equal(
      accounts[2],
      "logs the endorsed address"
    );
    web3.utils
      .fromWei(receipt.logs[0].args._amount, "wei")
      .should.be.equal(amount, "logs the amount endorsed");
    const endorsement = await this.debtInstance.endorsements(
      accounts[1],
      accounts[2]
    );
    endorsement.should.be.true;
    const endorsedStake = await this.debtInstance.endorsedStake(accounts[2]);
    web3.utils
      .fromWei(endorsedStake, "wei")
      .should.be.equal(
        web3.utils.toWei("1", "ether"),
        "Equal to endorsed of staker"
      );
    const userToStake = await this.debtInstance.userToEndorsedStake(
      accounts[1],
      accounts[2]
    );
    web3.utils
      .fromWei(userToStake, "wei")
      .should.be.equal(
        web3.utils.toWei("1", "ether"),
        "Equal to endorsed of staker"
      );
    let isException = false;
    try {
      await this.debtInstance.endorseUser(accounts[2], amount, {
        from: accounts[1]
      });
    } catch (err) {
      isException = true;
      assert(err.reason === "not enough stake");
    }
    expect(isException).to.be.equal(
      true,
      "it should revert on not a enough stake"
    );
    let availableToEndorse = await this.debtInstance.availableToEndorse(
      accounts[1]
    );
    Number(availableToEndorse).should.equal(0);
  });

  it("... should allow staker to remove endorsed user", async () => {
    const receipt = await this.debtInstance.declineEndorsement(accounts[2], {
      from: accounts[1]
    });
    receipt.logs.length.should.be.equal(1, "trigger one event");
    receipt.logs[0].event.should.be.equal(
      "LogDeclineEndorsement",
      "should be the LogDeclineEndorsement event"
    );
    receipt.logs[0].args._staker.should.be.equal(
      accounts[1],
      "logs the staker address"
    );
    receipt.logs[0].args._declined.should.be.equal(
      accounts[2],
      "logs the declined address"
    );
    const endorsement = await this.debtInstance.endorsements(
      accounts[1],
      accounts[2]
    );
    endorsement.should.be.false;
    const endorsedStake = await this.debtInstance.endorsedStake(accounts[2]);
    web3.utils
      .fromWei(endorsedStake, "wei")
      .should.be.equal(
        web3.utils.toWei("0", "ether"),
        "Endorsed stake should be 0"
      );
    const userToStake = await this.debtInstance.userToEndorsedStake(
      accounts[1],
      accounts[2]
    );
    web3.utils
      .fromWei(userToStake, "wei")
      .should.be.equal(
        web3.utils.toWei("0", "ether"),
        "Equal to endorsed of staker"
      );
    let availableToEndorse = await this.debtInstance.availableToEndorse(
      accounts[1]
    );
    web3.utils
      .fromWei(availableToEndorse, "wei")
      .should.be.equal(
        web3.utils.toWei("1", "ether"),
        "Available to endorse should be 1"
      );
  });
});
