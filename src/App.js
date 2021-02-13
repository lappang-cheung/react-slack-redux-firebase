// Required Packages
import React from 'react';
import { Grid } from 'semantic-ui-react';
import { Helmet } from 'react-helmet';

// Custom Components
import { SideBar } from './components/SideBar/SideBar';
import Messages from './components/Messages/Messages';
// CSS
import './App.css';

function App() {
  return (
    <>
      <Helmet>
        <title>Slacker | Home</title>
      </Helmet>
      <Grid columns='equal'>
        <SideBar />
        <Grid.Column className='messagepanel'>
          <Messages />
        </Grid.Column>

        <Grid.Column width={3}>
          <span>

          </span>
        </Grid.Column>
      </Grid>
    </>
  );
}

export default App;
