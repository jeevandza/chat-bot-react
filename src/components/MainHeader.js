import React from 'react'
import Menu from './mainheader components/Menu'
import { BrowserRouter as Router, Switch, Route, Link, useRouteMatch, useParams } from "react-router-dom";

  import AboutUS from './AboutUs';
 import Home from './Home'

const MainHeader = () => {


    return (
        <div>
            <Router>
            <ul className = 'main-header'>
            <div><Menu/> </div>
            <div>Toolbar</div>
            <div>Team</div>
            <Link to = "/about">About Us</Link>
            <Link to = "/" >Home</Link>
            
            </ul>
            <Switch>
               <Route exact path = '/about'>
                    <AboutUS/>
               </Route>
               <Route exact path ="/">
                   <Home/>
               </Route>
           </Switch>
            
            </Router>
       
        </div>
    )
}

export default MainHeader;