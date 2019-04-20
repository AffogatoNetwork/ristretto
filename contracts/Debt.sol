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

  mapping (address => uint256) public stakedAmount;

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

}
