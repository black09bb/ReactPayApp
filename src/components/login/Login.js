import React, {Component} from 'react'
import logo from '../../logoSD.png'
import fetch from 'node-fetch'
import {Redirect} from 'react-router-dom'
import {checkStatus} from '../Common'
import './Login.scss'

export default class Login extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            loading: false
        }
    }

    login = async () => {
        this.setState({loading: true, wrongPassword: false})
        let body = {
            email: this.state.email,
            password: this.state.password
        }

        const result = await fetch('http://localhost:8002/auth/login', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        }).then(checkStatus)
        .then(x => x.json())
        .catch(err => console.log('Error: ', err))

        result ? this.success(result) : this.setState({wrongPassword: true, loading: false})
    }

    wrongPassword = status => {
        if (status) {
            return <p className='credentials'> Invalid credentials </p>
        }
    }

    success = (result) => {
        localStorage.setItem('tokenDate', new Date())
        localStorage.setItem('token', result.token)
        localStorage.setItem('userId', result.user.id)
        this.setState({success: true, loading: false})
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };
    
    signUp = () => this.setState({register: true})

    signLoading = state => {
        if (state) {
            return (
                <div style={{width: '100%'}}>
                    <div style={{marginTop: '10px', marginLeft: '-75px'}}>
                        <div id="loader"></div>
                    </div>
                </div>
            )
        }
    }

    render() {
        const { success, register } = this.state
        if (success) {
            return <Redirect to="/app/dashboard" />
        }

        if (register) {
            return <Redirect to="/register" />
        }


        return (
            <div className='backgroundLogin'>
                <div className="login">
                    <img alt="" className="loginLogo" height={170} src={logo}/> <br/>

                    <h1 className="h3 mb-3 font-weight-normal"> Enter credentials </h1>
                    <div className="form-group">
                        <input name="email" type="email" className="form-control" placeholder="Email address" value={this.state.value} onChange={this.handleChange('email')}/>
                        <input name='password' type="password" className="form-control" placeholder="Password" value={this.state.value} onChange={this.handleChange('password')}/>
                    </div>
                    {this.signLoading(this.state.loading)}
                    {this.wrongPassword(this.state.wrongPassword)}
                    <div className='loginButtons'>
                        <button type="submit" className="btn btn-lg btn-block btn-150" onClick={this.signUp}>Sign Up</button>
                        <button type="submit" className="btn btn-lg btn-login btn-150" onClick={this.login}>Sign In</button>
                    </div>
                    <p className="mt-5 mb-3 text-muted">© Robert Mrowiec </p>
                </div>
            </div>
        )
    }
}