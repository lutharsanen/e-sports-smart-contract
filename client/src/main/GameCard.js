import Typography from "@material-ui/core/Typography";
import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  padding: {
    margin: theme.spacing(1, 0),
  },
  cardContent: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

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
}));

function GameCard({ game, web3, onBet }) {
  const classes = useStyles();
  const matchTime = formatDate(game.start);
  const matchType = game.type;
  const teamA = game.teamA;
  const teamB = game.teamB;

  const [state, setState] = React.useState({
    betAmount0: 0,
    betAmount1: 0,
    betDisplayed: false,
  });

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

  /*function toggleBetting(){
    setState({...state, betDisplayed: !state.betDisplayed});
  }*/

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
      <CardHeader title={matchTime} subheader={matchType} />

      <CardContent className={classes.cardContent}>
        <div>
          <img className={classes.teamLogo} src={teamA.image} alt={teamA.name}/>
          <Typography className={classes.padding} variant="body1">
            {teamA.name}
          </Typography>
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
        <Typography variant="body1">Vs.</Typography>
        <div>
          <img className={classes.teamLogo} src={teamB.image} alt={teamB.name}/>
          <Typography className={classes.padding} variant="body1">
            {teamB.name}
          </Typography>
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
      </CardContent>
    </Card>
  );
}

export default GameCard;
