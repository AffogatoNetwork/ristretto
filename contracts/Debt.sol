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

  /** @dev struct of debt object */ 
  struct debtStruct{
    address debtor;
    uint256 amount;
    address lender;
    string status; //pending, accepted, completed
  }

  /** @dev struct of user */ 
  struct user{
    uint256 stakedAmount;
    mapping( address => bool) endorsements;
    uint256 availableToEndorse;
    mapping( address => uint256) userToEndorsedStake;
  }

  /** @dev struct of debtor */ 
  struct debtor{
    uint256 endorsedStake;
    mapping( address => uint256) endorserToUserStake;
    address[] userEndorsers;
  }

  mapping (address => debtStruct) public debts;
  mapping (address => user) public lenders;
  mapping (address => debtor) public debtors;

  /** @notice Gets the amount stacked by an user.
    * @param _lender address of the lender.
    * @return staked amount.
    */
  function getLender(address _lender) public view 
  returns(
    uint256,
    uint256
  ){
    return(
      lenders[_lender].stakedAmount,
      lenders[_lender].availableToEndorse
    );

  }

  /** @notice Gets the amount stacked by an user.
    * @param _lender address of the lender.
    * @return staked amount.
    */
  function getStakedAmount(address _lender) public view returns(uint256){
    return lenders[_lender].stakedAmount;
  }

  /** @notice Gets the array of addresses that endorsed an user.
    * @param _debtor address of the debtor.
    * @return array of addresses.
    */
  function getUserEndorsers(address _debtor) public view returns(address[] memory){
    return debtors[_debtor].userEndorsers;
  }
 
  /** @notice Stakes money into the contract.
    * @dev increase the amount staked and the amount available to endorse.
    */
  function stakeMoney() public payable {
    lenders[msg.sender].stakedAmount = lenders[msg.sender].stakedAmount.add(msg.value);
    lenders[msg.sender].availableToEndorse = lenders[msg.sender].availableToEndorse.add(msg.value);
    emit LogStakeMoney(msg.sender, msg.value);
  }

  /** @notice Withdraws the staked money.
    * @param _amount amount to be returned to the owner.
    * @dev the amount can't be lended or endorsed in order to withdraw.
    */
  function withdrawStakeMoney(uint256 _amount) public {
    //require to not have a debt in progress
    require(lenders[msg.sender].stakedAmount >= _amount, "can't withdraw more than deposit");
    require(lenders[msg.sender].availableToEndorse >= _amount, "can't withdraw endorsed money");
    lenders[msg.sender].stakedAmount = lenders[msg.sender].stakedAmount.sub(_amount);
    lenders[msg.sender].availableToEndorse = lenders[msg.sender].availableToEndorse.sub(_amount);
    msg.sender.transfer(_amount);
    emit LogWithdrawStakeMoney(msg.sender, _amount);
  }

  /** @notice Endorse an user with an amount.
    * @param _endorsed The user that gets the endorsment.
    * @param _amount amount to be endorsed the user.
    * @dev the user needs to have stake available to endorse.
    */
  function endorseUser(address _endorsed, uint256 _amount) public {
    require(lenders[msg.sender].availableToEndorse >= _amount, "not enough stake");
    lenders[msg.sender].endorsements[_endorsed] = true;
    lenders[msg.sender].availableToEndorse = lenders[msg.sender].availableToEndorse.sub(_amount);
    debtors[_endorsed].endorsedStake = debtors[_endorsed].endorsedStake.add(_amount);
    lenders[msg.sender].userToEndorsedStake[_endorsed] = lenders[msg.sender].userToEndorsedStake[_endorsed].add(_amount);
    debtors[_endorsed].endorserToUserStake[msg.sender] = debtors[_endorsed].endorserToUserStake[msg.sender].add(_amount);
    debtors[_endorsed].userEndorsers.push(msg.sender);
    emit LogEndorse(msg.sender, _endorsed, _amount);
  }

  /** @notice Removes the endorsement of an user.
    * @param _endorsed The user that gets the endorsment removed.
    * @dev The user can't have a lending to be declined. The amount endorsed is returned to the staker.
    */
  function declineEndorsement(address _endorsed) public {
    //require to not have a debt in progress
    lenders[msg.sender].endorsements[_endorsed] = false;
    lenders[msg.sender].availableToEndorse = lenders[msg.sender].availableToEndorse.add(lenders[msg.sender].userToEndorsedStake[_endorsed]);
    debtors[_endorsed].endorsedStake = debtors[_endorsed].endorsedStake.sub(lenders[msg.sender].userToEndorsedStake[_endorsed]);
    lenders[msg.sender].userToEndorsedStake[_endorsed] = 0;
    for (uint i = 0; i < debtors[_endorsed].userEndorsers.length; i++){
      delete debtors[_endorsed].userEndorsers[i];
    }
    emit LogDeclineEndorsement(msg.sender, _endorsed);
  }

  /** @notice Creates a lend request that other users can fund.
    * @dev Locks the endorsed money for a time, if there is no lending cancel the request. The requester can only request half of what is endorsed.
    */
  function requestLending() public {
    uint256 amount = debtors[msg.sender].endorsedStake;
    debtors[msg.sender].endorsedStake = debtors[msg.sender].endorsedStake.sub(amount);
    //crear objeto con div(2)
    //al pagar multiplicar por 2
    emit LogRequestLending(msg.sender, amount.div(2));
  }
}
