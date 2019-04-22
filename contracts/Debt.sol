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
    //require to not have a debt in progress
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
    uint256 amount = endorsedStake[msg.sender];
    endorsedStake[msg.sender] = endorsedStake[msg.sender].sub(amount);
    //crear objeto con div(2)
    emit LogRequestLending(msg.sender, amount.div(2));
  }
}
