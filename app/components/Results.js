const React = require('react'),
    PropTypes = require('prop-types'),
    queryString = require('query-string'),
    api = require('../utils/api'),
    Link = require('react-router-dom').Link,
    PlayerPreview = require('./PlayerPreview'),
    Loading = require('./Loading');

const Profile = function (props) {
    console.log('Profile props: ', props.info);
    let info = props.info;

    return (
        <PlayerPreview avatar={info.avatar_url} username={info.login}>
            <ul className='space-list-items'>
                {info.name && <li>{info.name}</li>}
                {info.location && <li>{info.location}</li>}
                {info.company && <li>{info.company}</li>}
                <li>Followers: {info.followers}</li>
                <li>Following: {info.following}</li>
                <li>Public Repos: {info.public_repos}</li>
                {info.blog && <li><a href={info.blog}>{info.blog}</a></li>}
            </ul>
        </PlayerPreview>
    )
};

Profile.propTypes = {
    info: PropTypes.object.isRequired
};

const Player = function (props) {
    return (
        <div>
            <h1 className="header">{props.label}</h1>
            <h3 style={{textAlign: 'center'}}>Score: {props.score}</h3>
            <Profile info={props.profile}/>
        </div>
    )
};

Player.propTypes = {
    label: PropTypes.string.isRequired,
    score: PropTypes.number.isRequired,
    profile: PropTypes.object.isRequired
};

class Results extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            winner: null,
            loser: null,
            error: null,
            loading: true
        }
    }

    componentDidMount () {
        let players = queryString.parse(this.props.location.search);
        console.log('this = ', this);
        api.battle([
            players.playerOneName,
            players.playerTwoName
        ]).then(function (results) {

            console.log('Results:', results);
            if (results === null) {
                return this.setState(function () {
                    return {
                        error: 'Looks like there was error. Check that both users exist on Github',
                        loading: false
                    }
                });
            }

            this.setState(function () {
               return {
                   error: null,
                   winner: results[0],
                   loser: results[1],
                   loading: false
               }
            });

        }.bind(this));
    }

    render() {
        const error = this.state.error,
            winner = this.state.winner,
            loser = this.state.loser,
            loading = this.state.loading;

        if (loading) {
            return <Loading />;
        }

        if (error) {
            return (
                <div>
                    <p>{error}</p>
                    <Link to="/battle">Reset</Link>
                </div>
            )
        }

        return (
            <div className="row">
                <Player
                    label="Winner"
                    score={winner.score}
                    profile={winner.profile}
                />
                <Player
                    label="Loser"
                    score={loser.score}
                    profile={loser.profile}
                />
            </div>
        )
    }
}

module.exports = Results;