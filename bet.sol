/* use compiler 0.426+commit */

pragma solidity>0.4.25;

import "github.com/provable-things/ethereum-api/blob/master/oraclizeAPI_0.4.25.sol";

contract Betting is OraclizeI{


//++++++++++++++++++++++++ global vairables +++++++++++++++++

    /**
    @param minimumBet amount of minimal bet value
    @param totalBetOne is the total amount which is betted for team A
    @param totalBetTwo is the total amount which is betted for team B
    @param numberOfBets is the total number of incoming bets
    @param maxAmountOfBets is the maximal Number of bets allowed for a game
    **/
    address public owner;
    uint256 public minimumBet;
    uint256 maxAmountOfBets = 1000;

//++++++++++++++++++++++++ structs +++++++++++++++++++++++++++
    
    struct Teams {
        uint256 totalBetOne;
        uint256 totalBetTwo;
        uint256 numberOfBets;
    }

    struct Player {
        uint256 amountBet;
        uint16 teamSelected;
    }

//++++++++++++++++++++++++ events +++++++++++++++++++++++++++
    
    event GameInfo (
        uint gameID,


    );

//++++++++++++++++++++++++ arrays +++++++++++++++++++++++++++


    address[] public players;
    Games[] public games;

//++++++++++++++++++++++++ mapping +++++++++++++++++++++++++++

    mapping(address=> Player) public playerInfo;
    mapping(uint =>Teams) public teamsInfo;
    
//++++++++++++++++++++++++ functions +++++++++++++++++++++++++++

    constructor() public {
        // we could stil vary this value
        owner = msg.sender;
        minimumBet = 10000000000000000000;
    }


    function kill() public {
      if(msg.sender == owner) selfdestruct(owner);
    }

    /* checks if a player has already betted for a game */
    function checkPlayerExists(address player) public view returns (bool){
        for (uint256 i = 0; i < players.length; i++){
            if (players[i] == player){
                return true;
            }    
        } return false;
    }
    
    function _createNewGame( uint _gameid) private {
        require (msg.sender == owner);
        uint gameID = games.push(Zombie(_name, _dna)) - 1;
        emit GameInfo(gameID);
    }
    
    function bet(uint8 _teamSelected) public payable{
        require(!checkPlayerExists(msg.sender));
        require( msg.value >= minimumBet);
        playerInfo[msg.sender].amountBet = msg.value;
        playerInfo[msg.sender].teamSelected = _teamSelected;
        players.push(msg.sender);
        if (_teamSelected == 1){
            totalBetOne+=msg.value;
        }
        else{
            totalBetTwo+=msg.value;
        }
        
    }
    
    function get_Data() public {
        


    }
    
    
    
    
    function AmountOne() external view returns(uint256){
        return totalBetOne;
    }
    function AmountTwo() external view returns(uint256){
        return totalBetTwo;
    }
        
}