import React, { useState } from 'react'
import { Link } from 'react-router-dom'
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

const Register = () => {

    let user = {
        userName: '',
        email: '',
        password: '',
        confirmPassword: ''
    }

    let errors = []

    let userCollectionRef = firebase.database().ref('users')

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
        return !userState.userName.length ||
            !userState.password.length ||
            !userState.confirmPassword.length ||
            !userState.email.length;
    }

    const checkPassword = () => {
        if(userState.password.length < 8) {
            setErrorState((error) => error.concat({ message: "Password length should be greater than 8" }))
            return false
        } else if(userState.password !== userState.confirmPassword) {
            setErrorState((error) => error.concat({ message: "Passwords does not match" }))
            return false
        } else {
            return true
        }
    }

    const formatErrors = () => {
        return errorState.map((error, index) => <p key={index}>{error.message}</p>)
    }

    const updateUserDetails = createdUser => {
        setIsLoading(true)
        if (createdUser) {
            createdUser.user
            .updateProfile({
                displayName: userState.userName,
                photoURL: `http://gravatar.com/avatar/${createdUser.user.uid}?d=identicon`
            })
            .then(() => {
                saveUserInDB(createdUser)
                setIsLoading(false)
            })
            .catch(serverError => {
                setErrorState((error) => error.concat(serverError))
                setIsLoading(false)
            })
        }
    }

    const saveUserInDB = createdUser => {
        setIsLoading(true)
        userCollectionRef.child(createdUser.user.uid).set({
            displayName: createdUser.user.displayName,
            photoURL: createdUser.user.photoURL
        })
        .then(() => {
            setIsSuccess(true)
            setIsLoading(false)
        })
        .catch(serverError => {
            setErrorState((error) => error.concat(serverError))
            setIsLoading(false)
        })
    }

    const onSubmit = (event) => {
        event.preventDefault()
        setErrorState(() => [])
        setIsSuccess(false)

        if(checkForm()) {
            setIsLoading(true)
            firebase
                .auth()
                .createUserWithEmailAndPassword(userState.email, userState.password)
                .then(createdUser => {
                    updateUserDetails(createdUser)
                    setIsLoading(false)
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
                    Register
                </Header>
                <Form onSubmit={onSubmit}>
                    <Segment stacked>
                        <Form.Input
                            name="userName"
                            value={userState.userName}
                            icon="user"
                            iconPosition="left"
                            onChange={handleInput}
                            type="text"
                            placeholder="Username"
                        />

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

                        <Form.Input
                            name="confirmPassword"
                            value={userState.confirmPassword}
                            icon="lock"
                            iconPosition="left"
                            onChange={handleInput}
                            type="password"
                            placeholder="Confirm password"
                        />
                    </Segment>
                    <Button disabled={isLoading} loading={isLoading}>Submit</Button>
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
                        <h3>Successfully Registered</h3>
                    </Message>
                }
                {
                    <Message>
                        Already an user? <Link to="/login">Login</Link>
                    </Message>
                }
            </Grid.Column>
        </GridForm>
    )
}

export default Register