/* use compiler 0.5.17 */

pragma solidity >= 0.5.0 < 0.6.0;

import "./provableAPI_0.5.sol";

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
    uint128 private initializationfee = 2 ether;
    
    
    /* variables for the useage of provableAPI */
    string public ESPORTSRESULT;
    mapping(bytes32=>bool) validIds;
    event LogConstructorInitiated(string nextStep);
    event LogPriceUpdated(string price);
    event LogNewProvableQuery(string description);


//++++++++++++++++++++++++ structs +++++++++++++++++++++++++++

    struct PlayerInformation {
        uint256 amountBet;
        uint16 teamSelected;
    }

    struct Games {
        string TeamA;
        string TeamB;
        uint256 totalBetA;
        uint256 totalBetB;
        uint256 totalAmount;
    }
    
    struct Player{
        address playeraddress;
    }


//++++++++++++++++++++++++ events +++++++++++++++++++++++++++
    
    event GameInfo (
        uint gameID,
        string TeamA,
        string TeamB
    );

//++++++++++++++++++++++++ arrays +++++++++++++++++++++++++++


    //Player[] public players;
    Games[] public games;


//++++++++++++++++++++++++ mapping +++++++++++++++++++++++++++


    /* gameID -> user-address -> Player */
    mapping(uint => mapping(address=> PlayerInformation)) public playerInfo;
    /* gameID -> address */
    mapping(uint => Player[]) public addressInfo;
    /* gameID -> Game */
    mapping(uint=> Games) public betInfo;
    /* gameID -> Player */
    mapping(uint=> Player) public matchInfo;
    
    
//++++++++++++++++++++++++ logical functions +++++++++++++++++++++++++++

    constructor() public payable {
        require(msg.value >= initializationfee);
        // we could stil vary this value
        owner = msg.sender;
        // value is in wei
        minimumBet = 10000000;
        // initiate ProvableAPI
        emit LogConstructorInitiated("Constructor was initiated. Call 'updatePrice()' to send the Provable Query.");
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
    function createNewGame( string memory _teamA, string memory _teamB) public{
        require (msg.sender == owner);
        uint gameID = games.push(Games(_teamA, _teamB, 0, 0, 0)) - 1;
        betInfo[gameID] = Games(_teamA, _teamB, 0, 0, 0);
        emit GameInfo(gameID,_teamA,_teamB);
    }
    
    function bet(uint8 _teamSelected, uint _gameID) public payable{
        require(!checkPlayerExists(msg.sender,_gameID));
        require( msg.value >= minimumBet);
        playerInfo[_gameID][msg.sender].amountBet = msg.value;
        playerInfo[_gameID][msg.sender].teamSelected = _teamSelected;
        addressInfo[_gameID].push(Player(msg.sender));
        if (_teamSelected == 0){
            betInfo[_gameID].totalBetA+=msg.value;
        }
        else if (_teamSelected == 1){
            betInfo[_gameID].totalBetB+=msg.value;
        }
        betInfo[_gameID].totalAmount +=msg.value;
    }
    
    function _payout(uint _winner, uint _gameID) private {
        for (uint256 i = 0; i < addressInfo[_gameID].length; i++){
            address betaddress = addressInfo[_gameID][i].playeraddress;
            if (_winner == playerInfo[_gameID][betaddress].teamSelected){
                // no percentages available in solidity how to solve that?
                //uint winparticipation = playerInfo[_gameID][betaddress].amountBet/getWinnerAmount(_winner, _gameID);
                
                    
                }
            }
    } 
    

//++++++++++++++++++++++++ provable functions +++++++++++++++++++++++++++


    function __callback(bytes32 myid, string memory result) public {
        if (!validIds[myid]) revert();
        if (msg.sender != provable_cbAddress()) revert();
        ESPORTSRESULT = result;
        emit LogPriceUpdated(result);
        delete validIds[myid];
        updatePrice();
    }

    function updatePrice() public payable {
        if (provable_getPrice("URL") > 0) {
          emit LogNewProvableQuery("Provable query was NOT sent, please add some ETH to cover for the query fee");
        } else {
          emit LogNewProvableQuery("Provable query was sent, standing by for the answer..");
            bytes32 queryId =
                provable_query(60, "URL", "json(https://api.pro.coinbase.com/products/ETH-USD/ticker).price", 500000);
            validIds[queryId] = true;
        }
    }
    
//++++++++++++++++++++++++ view functions +++++++++++++++++++++++++++
    
    
    function getAmountTeamA(uint gameID) external view returns(uint256){
        return betInfo[gameID].totalBetA;
    }
    
    function getAmountTeamB(uint gameID) external view returns(uint256){
        return betInfo[gameID].totalBetB;
    }
    
    function getTotalAmount(uint gameID) external view returns(uint256){
        return betInfo[gameID].totalAmount;
    }
    
    function getBalance() external view returns (uint) {
        require(msg.sender == owner);
        return address(this).balance;
    }

    function getWinnerAmount(uint winner, uint gameID) external view returns(uint256){
        if (winner == 0) return betInfo[gameID].totalBetA;
        else return betInfo[gameID].totalBetB;
    }
        
}