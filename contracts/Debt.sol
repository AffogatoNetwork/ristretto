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
    address _endorsed
  );

  event LogDeclineEndorsement(
    address _staker,
    address _declined
  );

  mapping (address => uint256) public stakedAmount;
  mapping (address => mapping( address => bool)) public endorsements;

  function getStakedAmount() public view returns(uint256){
    return stakedAmount[msg.sender];
  }
 
  function stakeMoney() public payable {
    stakedAmount[msg.sender] = stakedAmount[msg.sender].add(msg.value);
    emit LogStakeMoney(msg.sender, msg.value);
  }

  function withdrawStakeMoney(uint256 _amount) public {
    stakedAmount[msg.sender] = stakedAmount[msg.sender].sub(_amount);
    msg.sender.transfer(_amount);
    emit LogWithdrawStakeMoney(msg.sender, _amount);
  }

  function endorseUser(address _endorsed) public{
    endorsements[msg.sender][_endorsed] = true;
    emit LogEndorse(msg.sender, _endorsed);
  }

  function declineEndorsement(address _endorsed) public{
    endorsements[msg.sender][_endorsed] = false;
    emit LogDeclineEndorsement(msg.sender, _endorsed);
  }

}
