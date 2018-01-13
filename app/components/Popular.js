const React = require('react');
var PropTypes = require('prop-types');
var api = require('../utils/api');

// Stateless Functional Component
const SelectLanguage = function (props) {
    const languages = ['All', 'JavaScript', 'Ruby', 'Java', 'CSS', 'Python'];

    return (
        <ul className="languages">
            {languages.map(function (lang) {
                // console.log('Down Here, ', this);
                return (
                    <li
                        style={lang === props.selectedLanguage ? { color: '#d0021b'}: null}
                        onClick={props.onSelectLanguage.bind(null, lang)}
                        key={lang}>
                        {lang}</li>
                )
            }, this)} {/*With ES6's arrow function, you won't need to pass this as the 2nd argument*/}
        </ul>
    )
}

SelectLanguage.propTypes = {
    selectedLanguage: PropTypes.string.isRequired,
    onSelectLanguage: PropTypes.func.isRequired
}
// SelectLanguage Component Ends

// Stateless Functional Component
const RepoGrid = function(props) {
    return (
        <ul className='popular-list'>
            {props.repos.map(function (repo, index) {
                return (
                    <li key={repo.name} className='popular-item'>
                        <div className='popular-rank'>#{index + 1}</div>
                        <ul className='space-list-items'>
                            <li>
                                <img
                                    className='avatar'
                                    src={repo.owner.avatar_url}
                                    alt={'Avatar for ' + repo.owner.login}
                                />
                            </li>
                            <li><a href={repo.html_url}>{repo.name}</a></li>
                            <li>@{repo.owner.login}</li>
                            <li>{repo.stargazers_count} stars</li>
                        </ul>
                    </li>
                )
            })}
        </ul>
    )
}

RepoGrid.propTypes = {
    repos: PropTypes.array.isRequired
}
// RepoGrid Component Ends

class Popular extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedLanguage: 'All',
            repos: null
        };

        this.updateLanguage = this.updateLanguage.bind(this); // Make it so that the this keyword inside of updateLanguage is always the component instance itself which will have a setState property.
        // console.log('updatedLanguage, ', this);
    }

    componentDidMount () {
        // AJAX
        this.updateLanguage(this.state.selectedLanguage);
    }

    updateLanguage(lang) {
        this.setState(function() {
           return {
               selectedLanguage: lang,
               repos: null
           }
        });

        // fetch the github api everytime we change the language
        api.fetchPopularRepos(lang)
            .then(function (repos) {
                this.setState(function () {
                    return {
                        repos: repos
                    }
                })
            }.bind(this));
    }

    render() {
        // console.log('Up Here, ', this); // References the Popular component itself

        return (
            <div>
                <SelectLanguage
                    selectedLanguage={this.state.selectedLanguage}
                    onSelectLanguage={this.updateLanguage}
                />
                {!this.state.repos
                    ? <p>LOADING!</p>
                    : <RepoGrid repos={this.state.repos} />}
            </div>
        )
    }
}

module.exports = Popular;