import logo from './logo.svg';
import './App.css';
import Movies from './components/movies'
import { Route, Redirect, Switch } from 'react-router-dom'
import Customers from './components/customers';
import Rentals from './components/rentals'
import NotFound from './components/notFound'
import NavBar from './components/navBar';
import React from 'react';
import MovieForm from './components/movieForm'
import LoginForm from './components/loginForm';
import RegisterForm from './components/registerForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { Component } from 'react'
import jwtDecode from 'jwt-decode';
import Logout from './components/logout';
import ProtectedRoute from './components/common/protectedRoute';

class App extends Component {
  state = {};
  componentDidMount() {
    try {
      const jwt = localStorage.getItem('token');
      const user = jwtDecode(jwt);
      this.setState({ user });
      console.log("user:", user);
    }
    catch (ex) {

    }

  }

  render() {
    const { user } = this.state;
    return (
      <React.Fragment>
        <ToastContainer></ToastContainer>
        <NavBar user={this.state.user}></NavBar>
        <main className="container">
          <Switch>
            <Route path='/register' component={RegisterForm}></Route>

            <ProtectedRoute path='/movies/:id' component={MovieForm}></ProtectedRoute>
            <Route path='/movies'
              render={props => <Movies {...props} user={this.state.user} />}>
            </Route>
            <Route path='/login' component={LoginForm}></Route>
            <Route path='/customers' component={Customers}></Route>
            <Route path='/rentals' component={Rentals}></Route>
            <Route path='/not-found' component={NotFound}></Route>
            <Redirect from='/' exact to='/movies'></Redirect>
            <Redirect to='/not-found' component='NotFound'></Redirect>
            <Route path='/logout' component={Logout}></Route>


          </Switch>
        </main >
      </React.Fragment >
    );
  }
}
export default App;
