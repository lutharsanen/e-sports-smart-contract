import React, {useEffect, useState} from 'react';
import MenuIcon from '@material-ui/icons/MenuOutlined';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Container from "@material-ui/core/Container";
import myMatches from './resources/matches';
import GameCard from './main/GameCard';
import Chip from "@material-ui/core/Chip";
import Slide from "@material-ui/core/Slide";
import Web3 from "web3";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#eee'
  },
  banner: {
    maxWidth: '80%',
    width: '400px',
    marginTop: '60px'
  },
  content: {
    margin: theme.spacing(2, 0),
  }
}));

function App() {
  const classes = useStyles();
  const games = myMatches.sort((a, b) => new Date(a.begin_at) - new Date(b.begin_at));
  const [state, setState] = useState({
    showUpcomingMatches: true,
    address: '',
    web3: '',
  });

  function toggleUpcomingMatches() {
    setState({...state, showUpcomingMatches: !state.showUpcomingMatches});
  }

  const ethereum = window.ethereum;
  // Modern DApp Browsers
  if (ethereum) {
    let web3 = new Web3(window.ethereum);
    try {
      window.ethereum.enable().then(function() {
        web3.eth.getAccounts( (error,acc) => {
          //this.setState is used to edit the state variables
          setState({...state, address: acc[0]});
        });

      });
    } catch(e) {
      alert('You have enable MetaMask in order to bet on games');
    }
  }
  // Legacy DApp Browsers
  else if (window.web3) {
    let web3 = new Web3(window.web3.currentProvider);
  }
  // Non-DApp Browsers
  else {
    alert('You have to install MetaMask !');
  }

  return (
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            E-Sport Betting App
          </Typography>
        </Toolbar>
      </AppBar>

      <Container
          maxWidth="sm">

        <img className={classes.banner} src={'https://cdn.pandascore.co/images/league/image/4158/800px-Esl_logo.png'} />

        <Typography className={classes.content} variant="h3" component="h2">
          ESL One: Road to Rio - Europe
        </Typography>
        <Typography className={classes.content} variant="body2" component="h2">
          Your Wallet address is {state.address}
        </Typography>

        <Chip
            color={state.showUpcomingMatches ? 'primary' : 'default'}
            label={'Upcoming Matches'}
            onClick={toggleUpcomingMatches}
        />
        <Chip
            color={!state.showUpcomingMatches ? 'primary' : 'default'}
            label={'Ended Matches'}
            onClick={toggleUpcomingMatches}
        />

        <div className={classes.content}>
          {games.map((game) => {
            const show = ((!game.end_at && state.showUpcomingMatches)
                || (game.end_at && !state.showUpcomingMatches));
            return (
                <Slide key={game.id} in={show} direction="right" mountOnEnter unmountOnExit>
                  <div className={classes.content}>
                    <GameCard game={game} />
                  </div>
                </Slide>);
          })}
        </div>
      </Container>

    </div>
  );
}

export default App;
