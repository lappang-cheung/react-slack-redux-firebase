import { Grid } from 'semantic-ui-react'

import Sidebar from './components/Sidebar/Sidebar'
import Messages from './components/Messages/Messages'

function App() {
  return (
    <Grid columns="equal">
      <Grid.Column width={3}>
        <Sidebar />
      </Grid.Column>
      
      <Grid.Column width={12}>
        <Messages />
      </Grid.Column>
      <Grid.Column width={3}>
        <span/>
      </Grid.Column>
    </Grid>
  );
}

export default App;
