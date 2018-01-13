const React = require('react'),
    ReactRouter = require('react-router-dom'),
    Router = ReactRouter.BrowserRouter,
    Route = ReactRouter.Route,
    Switch = ReactRouter.Switch,
    Nav = require('./Nav'),
    Home = require('./Home'),
    Popular = require('./Popular'),
    Battle = require('./Battle'),
    Results = require('./Results');

class App extends React.Component {
    render() {
        return (
        <Router>
            <div className="container">
                <Nav/>
                <Switch>
                    <Route exact path='/' component={Home} />
                    <Route exact path='/battle' component={Battle} />
                    <Route path='/battle/results' component={Results} />
                    <Route path='/popular' component={Popular} />
                    <Route render={function () {
                        return <h1>Page Not Found!</h1>
                    }} />
                </Switch>
            </div>
        </Router>
        )
    }
}

module.exports = App;