import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import { checkToken, checkStatus } from '../../Common';
import Loader from '../../navigation/Loader'

export default class ProjectsEdit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            fetch: false,
            loading: true,
            redirect: false,
            users: [],
            photo: ''
        }
    }

    componentDidMount() {
        const {id} = this.props.match.params
        
        checkToken(this.props.history)

        return fetch(`http://localhost:8002/projects/${id}`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then(checkStatus)
        .then(x => x.json())
        .then(x => {
            this.setState({
                name: x.name,
                description: x.description,
                priceNetto: x.priceNetto,
                priceBrutto: x.priceBrutto
            })
            console.log(this.state);
            
        }).then(x => this.setState({loading: false}))
    }

    editProject = () => { 
        const body = {
            name: this.state.name,
            priceNetto: this.state.priceNetto,
            priceBrutto: this.state.priceBrutto,
            description: this.state.description || 'No description'
        }
        this.setState({loading: true})
        return fetch('http://localhost:8002/projects', {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then(checkStatus)
        .then(x => x.json())
        .then(x => this.setState({loading: false, alert: true, redirect: true}))
    }
    
    handleChange = name => event => {
        if (name === 'priceNetto') {
            this.setState({
                [name]: (Number(event.target.value)).toFixed(2),
                priceBrutto: (Number(event.target.value * 1.23)).toFixed(2)
            });
        } else if (name === 'priceBrutto') {
            this.setState({
                [name]: (Number(event.target.value)).toFixed(2),
                priceNetto: (Number(event.target.value / 1.23)).toFixed(2)
            });
        }
        this.setState({
            [name]: event.target.value,
        });
    };

    photoUpload() {
        return
    }
    render() {
        
        const { loading, redirect } = this.state
        
        if (loading) {
            return <Loader/>
        }
        if (redirect) {
            return <Redirect to="/app/projects" />
        }

        return (
            <div className='mainDescription'>

                <div className='dashboard dashboard-projects'>
                    <p className='page-title'> Projects </p>
                    <p className='page-undertitle'> You're currently on project creating page </p>
                </div>

                <div className='addDiv'>
                    <p className='btn btn-projects btn-primary btn-projects-add' onClick={this.editProject}> Edit </p>
                </div>

                <div className='projectsCards projectsCards-add'> 
                    <div className='card' style={{ width: '100%' }}>
                        <div className='card-body' style={{ display: 'flex' }}>
                            <div className="form-group" >
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div style={{ textAlign: 'left', width: '30%'}}>
                                        Name <input name='name' type="text" className="form-control" placeholder={this.state.name} value={this.state.name} onChange={this.handleChange('name')}/>
                                        Netto price <input name='priceNetto' type="number" className="form-control"  placeholder={this.state.priceNetto} onChange={this.handleChange('priceNetto')}/>
                                    </div>
                                    <div style={{ textAlign: 'right', paddingRight: '100px', width: '40%' }}>
                                        Client <input name='name' type="select" className="form-control" placeholder="Client" value={this.state.client} onChange={this.handleChange('client')}/>
                                        Brutto price <input name='priceBrutto' type="number" className="form-control" placeholder="Price Brutto" value={this.state.priceBrutto} onChange={this.handleChange('priceBrutto')}/>
                                    </div>
                                </div>
                                <div style={{ paddingRight: '100px' }}>
                                    Description <input name='description' type="text" className="form-control" placeholder="Description" value={this.state.description} onChange={this.handleChange('description')}/>
                                </div>
                            </div>
                            <div className='uploadPhoto'>
                                <input type='file' name='projectPhoto' style={{ width: '240px' }} value={this.state.photo} onChange={this.photoUpload} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
