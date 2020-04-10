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
    
    
    /* variables for the useage of provableAPI */
    string public ESPORTSRESULT;
    mapping(bytes32=>bool) validIds;
    event LogConstructorInitiated(string nextStep);
    event LogPriceUpdated(string price);
    event LogNewProvableQuery(string description);


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
    mapping(uint=> Games) public betInfo;
    /* gameID -> Player */
    mapping(uint=> Player) public matchInfo;
//++++++++++++++++++++++++ functions +++++++++++++++++++++++++++

    constructor() public {
        // we could stil vary this value
        owner = msg.sender;
        // value is in wei
        minimumBet = 10000000;
        // initiate ProvableAPI
        provable_setCustomGasPrice(4000000000);
        emit LogConstructorInitiated("Constructor was initiated. Call 'updatePrice()' to send the Provable Query.");
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
    

    function __callback(bytes32 myid, string memory result) public {
        if (!validIds[myid]) revert();
        if (msg.sender != provable_cbAddress()) revert();
        ESPORTSRESULT = result;
        emit LogPriceUpdated(result);
        delete validIds[myid];
        updatePrice();
    }

    function updatePrice() public payable {
        if (provable_getPrice("URL") > this.balance) {
          emit LogNewProvableQuery("Provable query was NOT sent, please add some ETH to cover for the query fee");
        } else {
          emit LogNewProvableQuery("Provable query was sent, standing by for the answer..");
            bytes32 queryId =
                provable_query(60, "URL", "json(https://api.pro.coinbase.com/products/ETH-USD/ticker).price", 500000);
            validIds[queryId] = true;
        }
    }
    
    
    
    function AmountOne(uint gameID) external view returns(uint256){
        return betInfo[gameID].totalBetOne;
    }
    function AmountTwo(uint gameID) external view returns(uint256){
        return betInfo[gameID].totalBetTwo;
    }
        
}