/* use compiler 0.5.17 */

pragma solidity >= 0.5.0 < 0.6.0;

import "https://github.com/provable-things/ethereum-api/blob/master/provableAPI_0.5.sol";

contract Betting is usingProvable{


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

    struct Player {
        uint256 amountBet;
        uint16 teamSelected;
    }

    struct Games {
        string TeamA;
        string TeamB;
        uint256 totalBetOne;
        uint256 totalBetTwo;
        uint256 numberOfBets;
    }


//++++++++++++++++++++++++ events +++++++++++++++++++++++++++
    
    event GameInfo (
        uint gameID,
        string TeamA,
        string TeamB
    );

//++++++++++++++++++++++++ arrays +++++++++++++++++++++++++++


    address[] public players;
    Games[] public games;

//++++++++++++++++++++++++ mapping +++++++++++++++++++++++++++

    /* user-address -> Player */
    mapping(address=> Player) public playerInfo;
    /* gameID -> Game */
    mapping(uint=> Game) public betInfo;
    /* gameID -> Player */
    mapping(uint=> Player) public matchInfo;
//++++++++++++++++++++++++ functions +++++++++++++++++++++++++++

    constructor() public {
        // we could stil vary this value
        owner = msg.sender;
        // value is in wei
        minimumBet = 10000000;
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
    
    /* check if there is a function that let the owner pay for the gas */
    function _createNewGame( string memory _teamA, string memory _teamB) public{
        require (msg.sender == owner);
        uint gameID = games.push(Games(_teamA, _teamB, 0, 0, 0)) - 1;
        betInfo[gameID] = Games(_teamA, _teamB, 0, 0, 0);
        emit GameInfo(gameID,_teamA,_teamB);
    }
    
    function bet(uint8 _teamSelected, uint _gameID) public payable{
        require(!checkPlayerExists(msg.sender));
        require( msg.value >= minimumBet);
        playerInfo[msg.sender].amountBet = msg.value;
        playerInfo[msg.sender].teamSelected = _teamSelected;
        players.push(msg.sender);
        if (_teamSelected == 1){
            betInfo[_gameID].totalBetOne+=msg.value;
        }
        else{
            betInfo[_gameID].totalBetTwo+=msg.value;
        }
        
    }
    
    function get_Data() public {
        


    }
    
    
    
    
    function AmountOne(uint gameID) external view returns(uint256){
        return betInfo[_gameID].totalBetOne;
    }
    function AmountTwo(uint gameID) external view returns(uint256){
        return betInfo[_gameID].totalBetTwo;
    }
        
}