import React, { Component } from 'react'
import Joi from 'joi-browser'
import Form from './common/form';
import auth from '../services/authService'
import { Redirect } from 'react-router-dom';

class LoginForm extends Form {
    // username = React.createRef();
    // componentDidMount() {
    //     this.username.current.focus()
    // }
    schema = {
        username: Joi.string().required().label('Username'),
        password: Joi.string().required().label('Password')

    }

    state = {
        data: {
            username: '',
            password: ''
        },
        errors: {

        }
    }
    // validate = () => {
    //     const options = { abortEarly: false }
    //     const { error } = Joi.validate(this.state.data, this.schema, options)

    //     if (!error) return null;
    //     const errors = {};
    //     for (let item of error.details)
    //         errors[item.path[0]] = item.message;
    //     return errors;
    //     // const errors = {};
    //     // const { data } = this.state;
    //     // if (data.username.trim() === '')
    //     //     errors.username = "Username is required";
    //     // if (data.password.trim() === '')
    //     //     errors.password = "Password is required";
    //     // console.log("errors", errors);
    //     // return Object.keys(errors).length === 0 ? null : errors;
    // }
    // handleSubmit = e => {
    //     e.preventDefault();
    //     console.log("submitted",);
    //     // const username = this.username.current.value;
    //     const errors = this.validate();
    //     this.setState({ errors: errors || {} });
    //     if (errors) return;
    //     this.doSubmit();
    // }
    doSubmit = async () => {
        // call the server
        try {
            console.log("submitted",);
            const { data } = this.state;
            // const { data: jwt } = await login(data.username, data.password);
            await auth.login(data.username, data.password);
            // console.log("jwt:", jwt);
            // localStorage.setItem('token', jwt);
            // this.props.history.push('/');
            // window.location = '/';
            const { state } = this.props.location;
            window.location = state ? state.from.pathname : '/';

        }
        catch (ex) {
            if (ex.response && ex.response.status === 400) {
                const errors = { ...this.state.errors };
                errors.username = ex.response.data;
                this.setState({ errors });
            }
        }

    }
    // validateProperty = ({ name, value }) => {
    //     const obj = { [name]: value }
    //     const schema = { [name]: this.schema[name] };
    //     const { error } = Joi.validate(obj, schema);
    //     return error ? error.details[0].message : null;

    //     // if (name === 'username') {
    //     //     if (value.trim() === '') return 'Username is required'
    //     // }
    //     // if (name === 'password') {
    //     //     if (value.trim() === '') return 'Password is required'
    //     // }
    // }
    // handleChange = ({ currentTarget: input }) => {
    //     const errors = { ...this.state.errors }
    //     const errorMessage = this.validateProperty(input);
    //     if (errorMessage) errors[input.name] = errorMessage;
    //     else delete errors[input.name];
    //     const data = { ...this.state.data };
    //     data[input.name] = input.value;
    //     // data[e.currentTarget.name] = e.currentTarget.value;
    //     this.setState({ data, errors });
    // }
    render() {
        // const { data, errors } = this.state;
        if (auth.getCurrentUser()) return <Redirect to="/" />
        return (<div>
            <h1>login</h1>
            <form onSubmit={this.handleSubmit}>
                {this.renderInput('username', 'Username')}
                {this.renderInput('password', 'Password', 'password')}
                {this.renderButton("Login")}
            </form>
        </div >)
    }
}

export default LoginForm;
