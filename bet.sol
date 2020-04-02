/* use compiler 0.426+commit */

pragma solidity>0.4.25;

import "github.com/provable-things/ethereum-api/blob/master/oraclizeAPI_0.4.25.sol";

contract Betting is OraclizeI{
    /**
    @param minimumBet amount of minimal bet value
    @param totalBetOne is the total amount which is betted for team A
    @param totalBetTwo is the total amount which is betted for team B
    @param numberOfBets is the total number of incoming bets
    @param maxAmountOfBets is the maximal Number of bets allowed for a game
    **/
    address public owner;
    uint256 public minimumBet;
    uint256 public totalBetOne;
    uint256 public totalBetTwo;
    uint256 public numberOfBets;
    // we could still vary this value
    uint256 maxAmountOfBets = 1000;

    /**
    @notice stores all player addresses
    @param amountBet is bet amount used to bet
    @param teamSelected is the team the player selected
    */
    struct Player {
        uint256 amountBet;
        uint16 teamSelected;
    }
     /**
    @notice stores all games of the CL
    */
    struct Games {
        uint teamA;
        uint teamB;
        uint result;
    }
    /**
    @param players stores the structs of the players in an array
    */
    address[] public players;
    /**
    @param games stores the structs of games in an array
    */
    Games[] games;


    /**
    @notice maps the address of of the array to the Player's struct
    */
    mapping(address=> Player) public playerInfo;
    constructor() public {
        // we could stil vary this value
        owner = msg.sender;
        minimumBet = 10000000000000000000;
    }

    /**
    @notice kills the contract with the selfdestruct function
    */
    function kill() public {
      if(msg.sender == owner) selfdestruct(owner);
    }

    /**
    @notice  checks if player exists
    */
    function checkPlayerExists(address player) public view returns (bool){
        for (uint256 i = 0; i < players.length; i++){
            if (players[i] == player){
                return true;
            }    
        } return false;
    }
    /**
    @notice  function for betting
    */
    function bet (uint8 _teamSelected) public payable{
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