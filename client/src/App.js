import React, { useCallback, useEffect, useState } from "react";
import MenuIcon from "@material-ui/icons/MenuOutlined";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Container from "@material-ui/core/Container";
import GameCard from "./main/GameCard";
import Chip from "@material-ui/core/Chip";
import Slide from "@material-ui/core/Slide";
import axios from "axios";
import Web3 from "web3";
import {
  BETTING_CONTRACT_ABI,
  BETTING_CONTRACT_ADDRESS,
} from "./main/contracts";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#eee",
  },
  banner: {
    maxWidth: "80%",
    width: "400px",
    marginTop: "60px",
  },
  content: {
    margin: theme.spacing(2, 0),
  },
}));

function App() {
  const classes = useStyles();
  const [state, setState] = useState({
    showUpcomingMatches: true,
    upcomingMatches: [],
    pastMatches: [],
    bettingContractABI: [],
  });

  const web3 = new Web3(window.web3.currentProvider);
  const contract = new web3.eth.Contract(
    BETTING_CONTRACT_ABI,
    BETTING_CONTRACT_ADDRESS
  );
  const [account, setAccount] = React.useState(0);

  useEffect(() => {
    getGames();
    getAccount();
  }, [account]);

  const getAccount = useCallback(async () => {
    let accounts = await window.ethereum.enable();
    console.log(accounts[0]);
    setAccount(accounts[0]);

    window.ethereum.on("accountsChanged", function (accounts) {
      setAccount(accounts[0]);
    });
  }, [account]);

  const getGames = useCallback(async () => {
    axios
      .get("http://localhost:8080/games")
      .then((result) => {
        let upcomingMatches = result.data
          .filter((a) => new Date(a.start) > new Date())
          .sort((a, b) => new Date(a.start) - new Date(b.start));
        let pastMatches = result.data
          .filter((a) => new Date(a.start) < new Date())
          .sort((a, b) => new Date(a.start) - new Date(b.start));
        setState({
          ...state,
          upcomingMatches: upcomingMatches,
          pastMatches: pastMatches,
        });
      })
      .catch((error) => console.log("Error while loading data " + error));
  });

  function onBetHandler(gameId, teamId, amount) {
    console.log(account);
    console.log(amount);
    console.log(teamId, gameId);
    contract.methods
        .bet(teamId, gameId)
        .send({ from: account, value: amount, gas: 6721975 })
        .then((res) => console.log(res));
  }

  /*const getABI = useCallback(async () => {
    axios.get('http://localhost:5000/abi')
        .then(result => {
          let bettingContractABI = result.data;
          console.log(bettingContractABI)
          setState({...state, bettingContractABI: bettingContractABI});
        })
        .catch(error => console.log('Error while loading data ' + error ));

  });*/

  function toggleUpcomingMatches() {
    setState({ ...state, showUpcomingMatches: !state.showUpcomingMatches });
  }

  return (
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            E-Sport Betting App
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm">
        <img
          className={classes.banner}
          src={
            "https://cdn.pandascore.co/images/league/image/4158/800px-Esl_logo.png"
          }
          alt={"ESL ONE Logo"}
        />

        <Typography className={classes.content} variant="h3" component="h2">
          ESL One: Road to Rio - Europe
        </Typography>

        <Chip
          color={state.showUpcomingMatches ? "primary" : "default"}
          label={"Upcoming Matches"}
          onClick={toggleUpcomingMatches}
        />
        <Chip
          color={!state.showUpcomingMatches ? "primary" : "default"}
          label={"Past Matches"}
          onClick={toggleUpcomingMatches}
        />

        <div className={classes.content}>
          {state.upcomingMatches.map((game) => {
            return (
              <Slide
                key={game._id}
                in={state.showUpcomingMatches}
                direction="right"
                mountOnEnter
                unmountOnExit
              >
                <div className={classes.content}>
                  <GameCard
                    game={game}
                    web3={web3}
                    upcoming={true}
                    onBet={onBetHandler}
                  />
                </div>
              </Slide>
            );
          })}
          {state.pastMatches.map((game) => {
            return (
                <Slide
                    key={game._id}
                    in={!state.showUpcomingMatches}
                    direction="right"
                    mountOnEnter
                    unmountOnExit
                >
                  <div className={classes.content}>
                    <GameCard
                        game={game}
                        web3={web3}
                        upcoming={false}
                        onBet={onBetHandler}
                    />
                  </div>
                </Slide>
            );
          })}
        </div>
      </Container>
    </div>
  );
}

export default App;
