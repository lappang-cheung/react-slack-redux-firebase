import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import styled from 'styled-components'
import { 
    Grid, 
    Form, 
    Segment, 
    Header, 
    Icon,
    Button, 
    Message
} from 'semantic-ui-react'

import firebase from '../../../server/firebase'

const GridForm = styled(Grid)`
    padding: 1rem;
    height: 100vh;
    background: #eee;
`

const Login = () => {

    let user = {
        email: '',
        password: '',
    }

    let errors = []

    const [userState, setUserState] = useState(user)
    const [errorState, setErrorState] = useState(errors)
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess]  = useState(false)

    const handleInput = (event) => {
        let target = event.target;
        setUserState((currentState) => {
            let currentuser = { ...currentState }
            currentuser[target.name] = target.value
            return currentuser
        })
    }

    const checkForm = () => {
        if (isFormEmpty()) {
            setErrorState((error) => error.concat({ message: "Please fill in all fields" }));
            return false;
        }
        else if (!checkPassword()) {
            return false;
        }
        return true;
    }

    const isFormEmpty = () => {
        return !userState.password.length ||
            !userState.email.length;
    }

    const checkPassword = () => {
        if(userState.password.length < 8) {
            setErrorState((error) => error.concat({ message: "Password length should be greater than 8" }))
            return false
        } else {
            return true
        }
    }

    const formatErrors = () => {
        return errorState.map((error, index) => <p key={index}>{error.message}</p>)
    }

    const onSubmit = (event) => {
        event.preventDefault()
        setErrorState(() => [])
        setIsSuccess(false)

        if(checkForm()) {
            setIsLoading(true)
            firebase
                .auth()
                .signInWithEmailAndPassword(userState.email, userState.password)
                .then((user) => {
                    setIsLoading(false)
                    console.log(user)
                })
                .catch(serverError => {
                    setErrorState((error) => error.concat(serverError))
                    setIsLoading(false)
                })
        }
    }

    return (
        <GridForm verticalAlign="middle" textAlign="center" className="grid-form">
            <Grid.Column style={{
                maxWidth: '500px'
            }}>
                <Header icon as="h2">
                    <Icon name="slack" />
                    Login
                </Header>
                <Form onSubmit={onSubmit}>
                    <Segment stacked>
                        <Form.Input
                            name="email"
                            value={userState.email}
                            icon="mail"
                            iconPosition="left"
                            onChange={handleInput}
                            type="email"
                            placeholder="Email"
                        />

                        <Form.Input
                            name="password"
                            value={userState.password}
                            icon="lock"
                            iconPosition="left"
                            onChange={handleInput}
                            type="password"
                            placeholder="Password"
                        />
                    </Segment>
                    <Button disabled={isLoading} loading={isLoading}>Login</Button>
                </Form>
                {
                    errorState.length > 0  &&
                    <Message error>
                        <h3>Errors</h3>
                        {formatErrors()}
                    </Message>
                }
                {
                    isSuccess &&
                    <Message success>
                        <h3>Successfully Login</h3>
                    </Message>
                }
                {
                    <Message>
                        Not an user? <Link to="/register">Register</Link>
                    </Message>
                }
            </Grid.Column>
        </GridForm>
    )
}

export default Login