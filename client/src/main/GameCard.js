import Typography from "@material-ui/core/Typography";
import React, {useCallback, useEffect} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import CardActions from "@material-ui/core/CardActions";
import {BETTING_CONTRACT_ABI, BETTING_CONTRACT_ADDRESS} from "./contracts";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  betContainer:{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  bettingOdds: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#ccc",
    borderRadius: "50px",
    margin: theme.spacing(1, 0),
    width: "90%"
  },
  padding: {
    margin: theme.spacing(1, 0),
  },
  cardContent: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",

    "& > div": {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
  },
  teamLogo: {
    height: "80px",
  },
  amountInput: {
    width: "120px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  }
}));

function GameCard({ game, web3, onBet, upcoming}) {
  const classes = useStyles();
  const matchTime = formatDate(game.start);
  const matchType = game.type;
  const matchId = game._id;
  const teamA = game.teamA;
  const teamB = game.teamB;
  const contract = new web3.eth.Contract(
      BETTING_CONTRACT_ABI,
      BETTING_CONTRACT_ADDRESS
  );

  const [state, setState] = React.useState({
    betAmount0: 0,
    betAmount1: 0,
    betDisplayed: false,
    upcoming: upcoming
  });

  const [amountA, setAmountA] = React.useState(0);
  const [amountB, setAmountB] = React.useState(0);

  useEffect(() => {
    getAmounts();
  }, [amountA, amountB]);

  const getAmounts = useCallback(async () => {
    contract.methods.getAmountTeamA(game._id)
        .call()
        .then((res) => setAmountA(web3.utils.fromWei(res, "ether")));
    contract.methods.getAmountTeamB(game._id)
        .call()
        .then((res) => setAmountB(web3.utils.fromWei(res, "ether")));
    console.log(amountA,amountB)
  }, [amountA, amountB]);

  function formatDate(isoDateString) {
    if (!isoDateString) {
      return;
    }

    let options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    const date = new Date(isoDateString);

    return date.toLocaleDateString("en-US", options);
  }

  function handleBetAmount0Change(event) {
    setState({...state, betAmount0: event.target.value});
  }
  function handleBetAmount1Change(event) {
    setState({...state, betAmount1: event.target.value});
  }

  function toggleBetting(){
    setState({...state, betDisplayed: !state.betDisplayed});
    getAmounts();
  }

  function betOnGame(gameId, teamId) {
    let amount;
    if (teamId === 0 && state.betAmount0 > 0) {
      amount = web3.utils.toWei(state.betAmount0, "ether");
    } else if (teamId === 1 && state.betAmount1 > 0) {
      console.log(state.betAmount1)
      amount = web3.utils.toWei(state.betAmount1, "ether");
    }
    onBet(gameId, teamId, amount);
  }

  return (
    <Card className={classes.root}>
      <CardHeader title={matchTime} subheader={"Match: " + matchId + ", Gamemode: "+ matchType} />

      <CardContent className={classes.cardContent}>
        <div>
          <img className={classes.teamLogo} src={teamA.image} alt={teamA.name}/>
          <Typography className={classes.padding} variant="body1">
            {teamA.name}
          </Typography>
        </div>
        <div>
          <Typography variant="body1" className={classes.padding}>Vs.</Typography>
        </div>
        <div>
          <img className={classes.teamLogo} src={teamB.image} alt={teamB.name}/>
          <Typography className={classes.padding} variant="body1">
            {teamB.name}
          </Typography>



            </div>
      </CardContent>
      {state.betDisplayed ?
          <div className={classes.betContainer}>
            <Typography className={classes.padding} variant="body2">
              Who will win?
            </Typography>
            <div className={classes.bettingOdds}>
              <Typography className={classes.padding} variant="body2">
                {amountA + " ETH"}
              </Typography>
              <Typography className={classes.padding} variant="body2">
                {amountB + " ETH"}
              </Typography>
            </div>
            <div className={classes.cardContent}>
              <div className={classes.amountInput} >
                <TextField
                    id="bet-team-zero"
                    label="Amount in ETH"
                    type="number"
                    className={classes.padding}
                    onChange={handleBetAmount0Change}
                    InputLabelProps={{
                      shrink: true,
                    }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => betOnGame(game._id, 0)}
                >
                  Bet
                </Button>
              </div>
              <div className={classes.amountInput}>
                <TextField
                    id="bet-team-one"
                    label="Amount in ETH"
                    type="number"
                    className={classes.padding}
                    onChange={handleBetAmount1Change}
                    InputLabelProps={{
                      shrink: true,
                    }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => betOnGame(game._id, 1)}
                >
                  Bet
                </Button>
              </div>
            </div>

          </div> : null}
      {state.upcoming ?
      <CardActions>
        <Button size="small"  color="primary" onClick={toggleBetting}>Make a bet</Button>
      </CardActions>: null}
    </Card>
  );
}

export default GameCard;
