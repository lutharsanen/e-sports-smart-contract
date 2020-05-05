/* use compiler 0.5.17 */

pragma solidity >= 0.6.0 < 0.7.0;

import "./bugiclize.sol";

contract Betting is usingBugiclize{


//++++++++++++++++++++++++ global vairables +++++++++++++++++

    /**
    @param minimumBet amount of minimal bet value
    @param numberOfBets is the total number of incoming bets
    @param maxAmountOfBets is the maximal Number of bets allowed for a game
    **/
    address public owner;
    uint256 public minimumBet;
    uint256 maxAmountOfBets = 1000;


//++++++++++++++++++++++++ structs +++++++++++++++++++++++++++

    struct PlayerInformation {
        uint256 amountBet;
        uint16 teamSelected;
    }

    struct Games {
        uint256 totalBetA;
        uint256 totalBetB;
        uint256 totalAmount;
    }

    struct Player{
        address payable playeraddress;
    }


//++++++++++++++++++++++++ arrays +++++++++++++++++++++++++++


    Games[] public games;
    uint[] public allgames;


//++++++++++++++++++++++++ mapping +++++++++++++++++++++++++++


    /* gameID -> user-address -> Player */
    mapping(uint => mapping(address=> PlayerInformation)) public playerInfo;
    /* gameID -> user-address */
    mapping(uint => Player[]) public addressInfo;
    /* gameID -> Game */
    mapping(uint=> Games) public betInfo;



//++++++++++++++++++++++++ logical functions +++++++++++++++++++++++++++

    constructor() public payable {
        // we could stil vary this value
        owner = msg.sender;
        // value is in wei
        minimumBet = 10000000;
    }

    /* checks if a player has already betted for a game */
    function checkPlayerExists(address player, uint gameID) public view returns (bool){
        for (uint256 i = 0; i < addressInfo[gameID].length; i++){
            if (addressInfo[gameID][i].playeraddress == player){
                return true;
            }
        } return false;
    }


    /* check if there is a function that let the owner pay for the gas */
    function createNewGame( uint _gameid) public returns (uint) {
        require (msg.sender == owner,'This function is only accessible for the owner.');
        games.push(Games(0,0,0));
        allgames.push(_gameid);
        betInfo[_gameid] = Games(0,0,0);
        return _gameid;
    }

    /* betting function, which is accessible for everybody */
    function bet(uint8 _teamSelected, uint _gameID) public payable{
        require(!checkPlayerExists(msg.sender,_gameID), 'You are just allowed to bet once!');
        require(msg.value >= minimumBet, 'You need to pay more to be able to use this function');
        playerInfo[_gameID][msg.sender].amountBet = msg.value;
        playerInfo[_gameID][msg.sender].teamSelected = _teamSelected;
        addressInfo[_gameID].push(Player(msg.sender));
        if (_teamSelected == 0){
            betInfo[_gameID].totalBetA += msg.value;
        }
        else if (_teamSelected == 1){
            betInfo[_gameID].totalBetB += msg.value;
        }
        betInfo[_gameID].totalAmount += msg.value;
    }

    /* function, which is called by the owner. As soon as he receives the result, he will start the payout function. */
    function _payout(uint _gameID) public payable {
        require (msg.sender == owner, 'This function is only accessible for the owner.');
        uint _winner = usingBugiclize.Bugiclize_getResult(_gameID);
        uint payoutAmount = getTotalAmount(_gameID) - getTotalAmount(_gameID)/uint(100);
        for (uint256 i = 0; i < addressInfo[_gameID].length; i++){
            address payable betaddress = addressInfo[_gameID][i].playeraddress;
            if (_winner == playerInfo[_gameID][betaddress].teamSelected){
                uint winnerAmount = getWinnerAmount(_winner, _gameID);
                uint winparticipation = uint(playerInfo[_gameID][betaddress].amountBet)*uint(100000) / uint(winnerAmount);
                uint amountWon = uint(winparticipation) * uint(payoutAmount) / uint(100000);
                betaddress.transfer(amountWon);
            }
        }
    }




    function getAmountTeamA(uint gameID) public view returns(uint256){
        return betInfo[gameID].totalBetA;
    }

    function getAmountTeamB(uint gameID) public view returns(uint256){
        return betInfo[gameID].totalBetB;
    }

    function getTotalAmount(uint gameID) public view returns(uint256){
        return betInfo[gameID].totalAmount;
    }

    function getBalance() external view returns (uint) {
        require(msg.sender == owner, 'This function is only accessible for the owner.');
        return address(this).balance;
    }

    function getWinnerAmount(uint winner, uint gameID) public view returns(uint256){
        require(msg.sender == owner, 'This function is only accessible for the owner.');
        if (winner == 0){
            return betInfo[gameID].totalBetA;
        }
        else{
            return betInfo[gameID].totalBetB;
        }
    }

    function getstoredGames() public view returns( uint[] memory){
        return allgames;
    }
}