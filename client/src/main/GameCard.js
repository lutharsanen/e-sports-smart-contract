import Typography from "@material-ui/core/Typography";
import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";


const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    padding: {
        margin: theme.spacing(1, 0),
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
        height: '80px'
    }
}));

function GameCard({game}) {
    const classes = useStyles();
    const matchTime = formatDate(game.start);
    const matchType = game.type;
    const teamA = game.teamA;
    const teamB = game.teamB;

    function formatDate(isoDateString) {
        if (!isoDateString) {
            return;
        }

        let options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'};
        const date = new Date(isoDateString);

        return date.toLocaleDateString('en-US' ,options);
    }

    return (
        <Card className={classes.root}>
            <CardHeader title={matchTime} subheader={matchType} />

            <CardContent className={classes.cardContent}>
                <div>
                    <img className={classes.teamLogo} src={teamA.image} />
                    <Typography className={classes.padding} variant="body1">
                        {teamA.name}
                    </Typography>
                    <Button variant="contained" color="primary">
                        Bet on
                    </Button>
                </div>
                <Typography variant="body1">
                    Vs.
                </Typography>
                <div>
                    <img className={classes.teamLogo} src={teamB.image} />
                    <Typography className={classes.padding} variant="body1">
                        {teamB.name}
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
