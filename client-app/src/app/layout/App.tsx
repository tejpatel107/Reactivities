import { useEffect, useState } from 'react'
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDahsboard from '../../features/activities/dashboard/ActivityDashboard';
import LoadingComponent from './LoadingComponent';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';

function App() {

  const {activityStore} = useStore();
  
  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);

  if(activityStore.loading) return <LoadingComponent content="Loading app" />; 

  return (
    <>
      {/* <Header as="h2" icon={"users"} content="Reactivities" /> */}
      <NavBar />
      <Container style={{marginTop : "7em"}}>
        <ActivityDahsboard />
      </Container>
    </>
  )
}

export default observer(App);
