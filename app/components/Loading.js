const React = require('react'),
    PropTypes = require('prop-types');

const styles = {
    content: {
        textAlign: 'center',
        fontSize: '35px'
    }
};

class Loading extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            text: props.text
        };
    }

    componentDidMount() {
        var stopper = this.props.text + '...';
        this.intervalz = window.setInterval(function () {
            if (this.state.text === stopper) {
                this.setState(function () {
                    return {
                        text: this.props.text
                    }
                });
            } else {
                this.setState(function (previousState) {
                    return {
                        text: previousState.text + '.'
                    }
                });
            }
        }.bind(this), this.props.speed)
    }

    componentWillUnmount() {
        window.clearInterval(this.intervalz);
        console.log("Cleared the interval!");
    }

    render() {
        return (
            <p style={styles.content}>
                {this.state.text}
            </p>
        )
    }
}

Loading.propTypes = {
    text: PropTypes.string.isRequired,
    speed: PropTypes.number.isRequired,
};

Loading.defaultProps = {
    text: 'Loading',
    speed: 300
};


module.exports = Loading;