pragma solidity ^0.5.0;
import '../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol';

contract Debt {

  using SafeMath for uint256;

  event LogStakeMoney(
    address _staker,
    uint256 _amount
  );

  event LogWithdrawStakeMoney(
    address _staker,
    uint256 _amount
  );

  event LogEndorse(
    address _staker,
    address _endorsed,
    uint256 _amount
  );

  event LogDeclineEndorsement(
    address _staker,
    address _declined
  );

  mapping (address => uint256) public stakedAmount;
  mapping (address => mapping( address => bool)) public endorsements;
  mapping (address => uint256) public endorsedStake;
  mapping (address => uint256) public availableToEndorse;
  mapping (address => mapping( address => uint256)) public userToEndorsedStake;

  function getStakedAmount() public view returns(uint256){
    return stakedAmount[msg.sender];
  }
 
  function stakeMoney() public payable {
    stakedAmount[msg.sender] = stakedAmount[msg.sender].add(msg.value);
    availableToEndorse[msg.sender] = availableToEndorse[msg.sender].add(msg.value);
    emit LogStakeMoney(msg.sender, msg.value);
  }

  function withdrawStakeMoney(uint256 _amount) public {
    stakedAmount[msg.sender] = stakedAmount[msg.sender].sub(_amount);
    availableToEndorse[msg.sender] = availableToEndorse[msg.sender].sub(_amount);
    msg.sender.transfer(_amount);
    emit LogWithdrawStakeMoney(msg.sender, _amount);
  }

  function endorseUser(address _endorsed, uint256 _amount) public{
    require(availableToEndorse[msg.sender] >= _amount, "not enough stake");
    endorsements[msg.sender][_endorsed] = true;
    availableToEndorse[msg.sender] = availableToEndorse[msg.sender].sub(_amount);
    endorsedStake[_endorsed] = endorsedStake[_endorsed].add(_amount);
    userToEndorsedStake[msg.sender][_endorsed] = userToEndorsedStake[msg.sender][_endorsed].add(_amount);
    emit LogEndorse(msg.sender, _endorsed, _amount);
  }

  function declineEndorsement(address _endorsed) public{
    endorsements[msg.sender][_endorsed] = false;
    availableToEndorse[msg.sender] = availableToEndorse[msg.sender].add(userToEndorsedStake[msg.sender][_endorsed]);
    endorsedStake[_endorsed] = endorsedStake[_endorsed].sub(userToEndorsedStake[msg.sender][_endorsed]);
    userToEndorsedStake[msg.sender][_endorsed] = 0;
    emit LogDeclineEndorsement(msg.sender, _endorsed);
  }

}
