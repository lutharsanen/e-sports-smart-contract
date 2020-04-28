import React from 'react';
import MenuIcon from '@material-ui/icons/MenuOutlined';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Container from "@material-ui/core/Container";
import myMatches from './resources/matches';
import GameCard from './main/GameCard';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#eee'
  },
  content: {
    margin: theme.spacing(2, 0),
  }
}));

function App() {
  const classes = useStyles();

  const games = myMatches;
  return (
    <div className={classes.root}>
      <AppBar position="static">
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
        <Typography variant="h5" component="h2">
          Bets
        </Typography>

        <div className={classes.content}>
          {games.map((game) =>
              <div className={classes.content}>
                <GameCard game={game} />
              </div>
          )}
        </div>
      </Container>

    </div>
  );
}

export default App;
