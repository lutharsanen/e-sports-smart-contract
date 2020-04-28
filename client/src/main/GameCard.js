import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cardContent: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        '& > div': {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
        }
    },
    teamLogo: {
        height: '100px'
    }
}));

function GameCard({game}) {
    const classes = useStyles();
    const matchTime = formatDate(game.begin_at);
    const matchType = formatMatchType(game.match_type, game.number_of_games);
    const opponents = game.opponents;

    function formatDate(isoDateString) {
        if (!isoDateString) {
            return;
        }

        let options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'};
        const date = new Date(isoDateString);

        return date.toLocaleDateString('en-US' ,options);
    }

    function formatMatchType (matchType, nrOfGames) {
        if (matchType !== 'best_of') {
            return '';
        } else {
            return 'Best of ' + nrOfGames;
        }
    }

    return (
        <Card className={classes.root}>
            <CardHeader title={matchTime} subheader={matchType} />

            <CardContent className={classes.cardContent}>
                <div>
                    <img className={classes.teamLogo} src={opponents[0].opponent.image_url} />
                    <Typography variant="body1">
                        {opponents[0].opponent.name}
                    </Typography>
                    <Button variant="contained" color="primary">
                        Bet on
                    </Button>
                </div>
                <Typography variant="body1">
                    Vs.
                </Typography>
                <div>
                    <img className={classes.teamLogo} src={opponents[1].opponent.image_url} />
                    <Typography variant="body1">
                        {opponents[1].opponent.name}
                    </Typography>
                    <Button variant="contained" color="primary">
                        Bet on
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export default GameCard;
