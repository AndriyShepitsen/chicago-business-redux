import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { IndexLink } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import DocumentMeta from 'react-document-meta';
import { isLoaded as isInfoLoaded, load as loadInfo } from 'redux/modules/info';
import { isLoaded as isAuthLoaded, load as loadAuth, logout } from 'redux/modules/auth';
import { pushState } from 'redux-router';
import Radium from 'radium';
import connectData from 'helpers/connectData';
import config from '../../config';

function fetchData(getState, dispatch) {
    const promises = [];
    if (!isInfoLoaded(getState())) {
        promises.push(dispatch(loadInfo()));
    }
    if (!isAuthLoaded(getState())) {
        promises.push(dispatch(loadAuth()));
    }
    return Promise.all(promises);
}
@Radium
@connectData(fetchData)
@connect(
    state => ({user: state.auth.user}),
    {logout, pushState})
export default class App extends Component {
    static propTypes = {
        children: PropTypes.object.isRequired,
        user: PropTypes.object,
        logout: PropTypes.func.isRequired,
        pushState: PropTypes.func.isRequired
    };

    static contextTypes = {
        store: PropTypes.object.isRequired
    };

    componentWillReceiveProps(nextProps) {
        if (!this.props.user && nextProps.user) {
            // login
            this.props.pushState(null, '/loginSuccess');
        } else if (this.props.user && !nextProps.user) {
            // logout
            this.props.pushState(null, '/');
        }
    }

    handleLogout = (event) => {
        event.preventDefault();
        this.props.logout();
    }

    render() {
        const {user} = this.props;
        return (
            <div>
                <DocumentMeta {...config.app}/>

                <nav style={styles.base}>Menu</nav>


            </div>
        );
    }
}
var styles = {
    base: {
        display: 'block',
        width: '100%',
        height: '6.5rem',
        background: '#fff',
        zIndex: 99,
        borderTop: '1 solid #eee',
        borderBottom: '1px solid #eee'

    }
}
