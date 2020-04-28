/* use compiler 0.5.17 */

pragma solidity >= 0.6.0 < 0.7.0;


contract usingBugiclize{
    
    address public oracle_owner;
    
    
    uint[] public allgames;
    
    
    event Gamecreated(uint gameid);
    event Gamefinished(uint gameid);
    
    mapping (uint => uint) gamewinners;
    
    
    constructor() public {
        oracle_owner = msg.sender;
        
    }
    
    function createGame(uint gameid) public {
        require(msg.sender == oracle_owner);
        allgames.push(gameid);
        emit Gamecreated(gameid);
    }
    
    function updateResult(uint winner, uint gameid) public {
        require(msg.sender == oracle_owner);
        gamewinners[gameid] = winner;
        emit Gamefinished(gameid);
    }
    
    function getstoredGames()public view returns( uint  [] memory){
        return allgames;
    }
    
    
    function getResult(uint gameid)public payable returns(uint){
        require(msg.value > 0.5 ether);
        return gamewinners[gameid];
    }
    
    

}