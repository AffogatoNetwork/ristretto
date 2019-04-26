pragma solidity ^0.5.0;
import '../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol';

contract Debt {

  using SafeMath for uint256;
  
  /** @notice Logs when an User stakes money. */
  event LogStakeMoney(
    address _staker,
    uint256 _amount
  );

  /** @notice Logs when an User withdraws stake money. */
  event LogWithdrawStakeMoney(
    address _staker,
    uint256 _amount
  );

  /** @notice Logs when an User endorses another user. */
  event LogEndorse(
    address _staker,
    address _endorsed,
    uint256 _amount
  );

  /** @notice Logs when an User removes endorsement of another user. */
  event LogDeclineEndorsement(
    address _staker,
    address _declined
  );
  
  /** @notice Logs when an User requests a lending. */
  event LogRequestLending(
    address _requester,
    uint256 _amount
  );

  /** @notice Logs when an User lends money. */
  event LogLendMoney(
    address _debtor,
    address _lender,
    uint256 _amount
  );
  
  /** @notice Logs when an User repays money. */
  event LogRepayDebt(
    address _debtor,
    address _payer,
    uint256 _amount
  );

  /** @dev struct of debt object */ 
  struct debtStruct{
    address debtor;
    uint256 amount;
    address lender;
    string status; //requested, accepted, completed
    uint256 debtTotalAmount; /** @dev amount + 5% */
    uint256 repaidAmount;
  }

  /** @dev mapping of users and it's staked amount */ 
  mapping (address => uint256) public stakedAmount; 
  /** @dev mapping of users endorsed by an user */ 
  mapping (address => mapping( address => bool)) public endorsements;
  /** @dev mapping of stake endorsed money available used for request lending */ 
  mapping (address => uint256) public endorsedStake;
  /** @dev mapping of stake money of a user available to endorse to another user */ 
  mapping (address => uint256) public availableToEndorse;
  /** @dev mapping of money endorsed from an user to an endorsed user */ 
  mapping (address => mapping( address => uint256)) public userToEndorsedStake;
  /** @dev mapping of money endorsed from an user to another */ 
  mapping (address => mapping( address => uint256)) public endorserToUserStake;
  /** @dev mapping of an array of users endorsing another user */ 
  mapping (address => address[]) public userEndorsers;
  /** @dev mapping of an array of users endorsing another user */ 
  mapping (address => debtStruct) public debts;

  /** @notice Gets the amount stacked by an user.
    * @param _staker address of the staker.
    * @return staked amount.
    */
  function getStakedAmount(address _staker) public view returns(uint256){
    return stakedAmount[_staker];
  }

  /** @notice Gets the array of addresses that endorsed an user.
    * @param _owner address of the owner.
    * @return array of addresses.
    */
  function getUserEndorsers(address _owner) public view returns(address[] memory){
    return userEndorsers[_owner];
  }

  /** @notice Stakes money into the contract.
    * @dev increase the amount staked and the amount available to endorse.
    */
  function stakeMoney() public payable {
    stakedAmount[msg.sender] = stakedAmount[msg.sender].add(msg.value);
    availableToEndorse[msg.sender] = availableToEndorse[msg.sender].add(msg.value);
    emit LogStakeMoney(msg.sender, msg.value);
  }

  /** @notice Withdraws the staked money.
    * @param _amount amount to be returned to the owner.
    * @dev the amount can't be lended or endorsed in order to withdraw.
    */
  function withdrawStakeMoney(uint256 _amount) public {
    //require to not have a debt in progress
    require(stakedAmount[msg.sender] >= _amount, "can't withdraw more than deposit");
    require(availableToEndorse[msg.sender] >= _amount, "can't withdraw endorsed money");
    stakedAmount[msg.sender] = stakedAmount[msg.sender].sub(_amount);
    availableToEndorse[msg.sender] = availableToEndorse[msg.sender].sub(_amount);
    msg.sender.transfer(_amount);
    emit LogWithdrawStakeMoney(msg.sender, _amount);
  }

  /** @notice Endorse an user with an amount.
    * @param _endorsed The user that gets the endorsment.
    * @param _amount amount to be endorsed the user.
    * @dev the user needs to have stake available to endorse.
    */
  function endorseUser(address _endorsed, uint256 _amount) public {
    require(availableToEndorse[msg.sender] >= _amount, "not enough stake");
    endorsements[msg.sender][_endorsed] = true;
    availableToEndorse[msg.sender] = availableToEndorse[msg.sender].sub(_amount);
    endorsedStake[_endorsed] = endorsedStake[_endorsed].add(_amount);
    userToEndorsedStake[msg.sender][_endorsed] = userToEndorsedStake[msg.sender][_endorsed].add(_amount);
    endorserToUserStake[_endorsed][msg.sender] = endorserToUserStake[_endorsed][msg.sender].add(_amount);
    userEndorsers[_endorsed].push(msg.sender);
    emit LogEndorse(msg.sender, _endorsed, _amount);
  }

  /** @notice Removes the endorsement of an user.
    * @param _endorsed The user that gets the endorsment removed.
    * @dev The user can't have a lending to be declined. The amount endorsed is returned to the staker.
    */
  function declineEndorsement(address _endorsed) public {
    require(keccak256(abi.encodePacked((debts[_endorsed].status))) == keccak256(abi.encodePacked((""))), "there shouldn't existe any debt");
    endorsements[msg.sender][_endorsed] = false;
    availableToEndorse[msg.sender] = availableToEndorse[msg.sender].add(userToEndorsedStake[msg.sender][_endorsed]);
    endorsedStake[_endorsed] = endorsedStake[_endorsed].sub(userToEndorsedStake[msg.sender][_endorsed]);
    userToEndorsedStake[msg.sender][_endorsed] = 0;
    for (uint i = 0; i < userEndorsers[_endorsed].length; i++){
      delete userEndorsers[_endorsed][i];
    }
    emit LogDeclineEndorsement(msg.sender, _endorsed);
  }

  /** @notice Creates a lend request that other users can fund.
    * @dev Locks the endorsed money for a time, if there is no lending cancel the request. The requester can only request half of what is endorsed.
    */
  function requestLending() public {
    require(keccak256(abi.encodePacked((debts[msg.sender].status))) == keccak256(abi.encodePacked((""))), "there shouldn't existe any debt");
    uint256 amount = endorsedStake[msg.sender].div(2);
    uint256 percentageAmount =  (amount.mul(5)).div(100);
    uint256 totalAmount =  percentageAmount.add(amount);
    endorsedStake[msg.sender] = endorsedStake[msg.sender].sub(endorsedStake[msg.sender]);
    debts[msg.sender] = debtStruct(msg.sender, amount, address(0), "requested", totalAmount, 0);
    emit LogRequestLending(msg.sender, amount);
  }

  /** @notice Lends money to the user that requested.
    * @param _debtor The user that gets the lending.
    * @dev the user needs to pay what is requested in the debt.
    */
  function lendMoney(address payable _debtor) public payable {
    require(keccak256(abi.encodePacked((debts[_debtor].status))) == keccak256(abi.encodePacked(("requested"))), "debt status should be requested");
    require(msg.value == debts[_debtor].amount, "amount must equal requested");
    debtStruct storage debt = debts[_debtor];
    debt.status = "accepted";
    _debtor.transfer(msg.value);
    emit LogLendMoney(_debtor, msg.sender, msg.value);
  }

  /** @notice Repay debt.
    * @param _debtor The user that needs to repay.
    * @dev the user can't repay more that debt.
    */
  function repayDebt(address _debtor) public payable {
    require(keccak256(abi.encodePacked((debts[_debtor].status))) == keccak256(abi.encodePacked(("accepted"))), "debt status should be accepted");
    require(msg.value.add(debts[_debtor].repaidAmount) <= debts[_debtor].debtTotalAmount, "can't repay more than debt");
    debtStruct storage debt = debts[_debtor];
    debt.repaidAmount = debt.repaidAmount.add(msg.value);
    if(debt.repaidAmount == debt.debtTotalAmount){
      debt.status = "completed";
    }
    emit LogRepayDebt(_debtor, msg.sender, msg.value);
  }

  //Withdraw earnings
  //close debt
}
