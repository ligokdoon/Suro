import React from 'react';
import { AuthRoute } from '../util/route_util';
import Modal from './modal/modal';
import NavBar from './navbar_container';
import Search from './search/search';
import Covid from './splash/covid'
import Category from './splash/category';
import Discover from './splash/discover';
import HostLearn from './splash/host_learn'
import Footer from './splash/footer';
import LoginFormContainer from './session/login_form_container';
import SignupFormContainer from './session/signup_form_container';

const App = () => {
    return (
        <div>
            <Modal />
            <header>
                <NavBar />
            </header>
            <Search />
            <Covid />
            <Category />
            <Discover />
            <HostLearn />
            <Footer />
        </div>
    )
}

export default App;