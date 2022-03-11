import React, { Fragment } from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import Login from '../pages/Login'
import NewsSandBox from '../pages/NewsSandBox'
import VistorIndex from '../pages/Vistor/VistorIndex'
import VistorDetail from '../pages/Vistor/VistorDetail'


export default function IndexRouter() {

    return (
        <Fragment>
            <Switch>
                <Route path="/login" component={Login} />
                <Route path="/vistor" component={VistorIndex} />
                <Route path="/detail/:id" component={VistorDetail} />
                <Route path="/" render={() =>
                    localStorage.getItem("token") ?
                        <NewsSandBox></NewsSandBox> :
                        <Redirect to="/login" />
                } />
            </Switch>

        </Fragment>
    )
}
