//  Required Pckage
import React, { useState } from 'react';
import { 
    Grid, 
    Form, 
    Segment, 
    Header, 
    Icon, 
    Button, 
    Message 
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';

import actionCodeSettings from '../../../server/email-link-auth'

// Custom Package
import firebase from '../../../server/firebase';

const StyledGrid = styled(Grid)`
    padding: 1rem;
    height: 100vh;
    background: #eee;
`

const Login = () => {
    // User object
    let user = {
        email: '',
        password: ''
    }

    // Error array
    let errors = [];

    //  State
    const [userState, setuserState] = useState(user);
    const [isLoading, setIsLoading] = useState(false);
    const [hasPressed, setHasPressed] = useState(false)
    const [errorState, seterrorState] = useState(errors);
    const [OTP, setOTP] = useState(false)

    // Multiple inputs
    const handleInput = (event) => {
        let target = event.target;
        setuserState((currentState) => {
            let currentuser = { ...currentState };
            currentuser[target.name] = target.value;
            return currentuser;
        })
    }

    // Form validation
    const checkForm = () => {
        if (isFormEmpty()) {
            seterrorState((error) => error.concat({ message: "Please fill in all fields" }));
            return false;
        }
        return true;
    }

    const isFormEmpty = () => {
        return !userState.password.length ||
            !userState.email.length;
    }

    const formaterrors = () => {
        return errorState.map((error, index) => <p key={index}>{error.message}</p>)
    }

    // OTP logic
    const onSubmitPasswordless = (event) => {
        setIsLoading(true);
        setHasPressed(true)
        firebase.auth()
            .sendSignInLinkToEmail(userState.email, actionCodeSettings)
            .then(() => {
                window.localStorage.setItem('emailForSignIn', userState.email)
                setIsLoading(false)
            })
            .catch(serverError => {
                setIsLoading(false)
                seterrorState((error) => error.concat(serverError.message))
            })
    }

    // Submit to firebase
    const onSubmit = (event) => {
        seterrorState(() => []);
        if (checkForm()) {
            setIsLoading(true);
           
            firebase.auth()
                .signInWithEmailAndPassword(userState.email, userState.password)
                .then(user => {
                    setIsLoading(false);
                    console.log(user);
                })
                .catch(serverError => {
                    setIsLoading(false);
                    seterrorState((error) => error.concat(serverError));
                })
        }
    }

    let renderForm

    if(OTP) {
       renderForm = <Form onSubmit={onSubmitPasswordless}>
            <Segment stacked>
                <Form.Input
                    name="email"
                    value={userState.email}
                    icon="mail"
                    iconPosition="left"
                    onChange={handleInput}
                    type="email"
                    placeholder="User Email"
                />
            </Segment>
            <Button disabled={isLoading} loading={isLoading}>Login</Button>
        </Form>
    } else {
        renderForm = <Form onSubmit={onSubmit}>
            <Segment stacked>
                <Form.Input
                    name="email"
                    value={userState.email}
                    icon="mail"
                    iconPosition="left"
                    onChange={handleInput}
                    type="email"
                    placeholder="User Email"
                />
                <Form.Input
                    name="password"
                    value={userState.password}
                    icon="lock"
                    iconPosition="left"
                    onChange={handleInput}
                    type="password"
                    placeholder="User Password"
                />
            </Segment>
            <Button disabled={isLoading} loading={isLoading}>Login</Button>
        </Form>
    }

    return (
        <>
        <Helmet>
            <title>Slacker | Login</title>
        </Helmet>
        <StyledGrid 
            verticalAlign="middle" 
            textAlign="center" 
            className="grid-form" 
        >
            <Grid.Column style={{ maxWidth: '500px' }}>
                <Header icon as="h2">
                    <Icon name="slack" />
                Login
            </Header>
                {renderForm}
                {errorState.length > 0 && OTP === false && <Message error>
                    <h3>Errors</h3>
                    {formaterrors()}
                </Message>
                }
                <Message>
                    <Button onClick={() => setOTP(!OTP)}>
                        {OTP ? 'Regular Login' : ' One Time Password'} 
                    </Button>
                </Message>
                {
                    hasPressed && <Message>
                    Please check your <a href="mailto:" >inbox</a>!
                </Message>
                }
                <Message>
                    Not an User? <Link to="/register" >Register </Link>
                </Message>
            </Grid.Column>
        </StyledGrid>
        </>
    )
}

export default Login;