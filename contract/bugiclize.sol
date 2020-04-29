/* use compiler 0.5.17 */

pragma solidity >= 0.6.0 < 0.7.0;


contract usingBugiclize{
    
    address public oracle_owner;
    
    
    uint[] public allgames;
    
    
    event Gamecreated(uint gameid);
    event Gamefinished(uint gameid);
    
    mapping (uint => uint) gamewinners;
    
    
    constructor() public {
        oracle_owner = 0xeFb4666BA4394AeF0351F24335BD80b2e0c75FE5;
        
    }
    
    function Bugiclize_createGame(uint gameid) public {
        require(msg.sender == oracle_owner);
        allgames.push(gameid);
        emit Gamecreated(gameid);
    }
    
    function Bugiclize_updateResult(uint winner, uint gameid) public {
        require(msg.sender == oracle_owner);
        gamewinners[gameid] = winner;
        emit Gamefinished(gameid);
    }
    
    function Bugiclize_getstoredGames() public view returns( uint  [] memory){
        return allgames;
    }
    
    
    function Bugiclize_getResult(uint gameid) public payable returns(uint){
        require(msg.value > 0.5 ether);
        return gamewinners[gameid];
    }
    
    

}