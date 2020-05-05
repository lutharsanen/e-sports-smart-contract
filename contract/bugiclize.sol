/* use compiler 0.5.17 */

pragma solidity >= 0.6.0 < 0.7.0;


contract usingBugiclize{

    address public oracle_owner;

    event Gamecreated(uint gameid);
    event Gamefinished(uint gameid);

    mapping (uint => uint) gamewinners;

    constructor() public {
        oracle_owner = 0x77d7f9fD92691D56fDd0DBB735eC961840a624A5;

    }

    function Bugiclize_createGame(uint gameid) public {
        require(msg.sender == oracle_owner, 'This function is only accessible for the owner.');
        emit Gamecreated(gameid);
    }

    function Bugiclize_updateResult(uint winner, uint gameid) public {
        require(msg.sender == oracle_owner, 'This function is only accessible for the owner.');
        gamewinners[gameid] = winner;
        emit Gamefinished(gameid);
    }


    function Bugiclize_getResult(uint gameid) public payable returns(uint){
        require(msg.value > 0.5 ether, 'Please not, that there is a fee of 0.5 ether');
        return gamewinners[gameid];
    }

}