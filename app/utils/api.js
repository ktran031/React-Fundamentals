const axios = require('axios');

const id = "f274189e3526c9df22ff",
    sec = "d01a4ddf7b81f64a5b773d467c9b9b2a219aa32c",
    params = `?client_id=${id}&client_secret=${sec}`;

const getProfile = function(username) {
    return axios.get(`https://api.github.com/users/${username}${params}`)
        .then(function (user) {
            return user.data;
        })
};
console.log(getProfile('tylermcginnis'));

const getRepos = function (username) {
    return axios.get(`https://api.github.com/users/${username}/repos${params}&per_page=100`)
};
console.log(getRepos('tylermcginnis'));

const getStarCount = function (repos) {
    return repos.data.reduce(function (count, repo) {
        return count + repo.stargazers_count;
    }, 0);
};

const calculateScore = function (profile, repos) {
  let followers = profile.followers,
      totalStars = getStarCount(repos);

  return (followers * 3) + totalStars;
};

const handleError = function (error) {
    console.warn(error);
    return null;
};

const getUserData = function (player) {
    return axios.all([
        getProfile(player),
        getRepos(player)
    ]).then(function (data) {
        let profile = data[0], // getProfile(player)
            repos = data[1]; // getRepos(player)

        return {
            profile: profile,
            score: calculateScore(profile, repos)
        }
    })
};

const sortPlayers = function (players) {
    return players.sort(function (a, b) {
        return b.score - a.score;
    });
};

module.exports = {
    battle: function (players) {
      return axios.all(players.map(getUserData))
          .then(sortPlayers)
          .catch(handleError)
    },
    
    fetchPopularRepos: function (language) {
        var encodedURI = window.encodeURI('https://api.github.com/search/repositories?q=stars:>1+language:'+ language + '&sort=stars&order=desc&type=Repositories');

        return axios.get(encodedURI)
            .then(function (response) {
                return response.data.items;
            });
    }
};