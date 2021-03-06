import React from 'react';
import ReactDOM from 'react-dom';
import configureStore from './store/store';
import Root from './components/root';
import {fetchcars, fetchcar, fetchfeatures} from './actions/car_actions';
import { fetchbooking, createbooking } from './actions/booking_actions';

document.addEventListener('DOMContentLoaded', () => {

    const root = document.getElementById("root");
    let store = configureStore();

    if (window.currentUser) {
        const preloadedState = {
            entities: {
                users: { [window.currentUser.id]: window.currentUser }
            },
            session: { id: window.currentUser.id }
        };

        store = configureStore(preloadedState);
        delete window.currentUser;
    }

    window.getState = store.getState;
    window.dispatch = store.dispatch;
    window.fetchcars = fetchcars;
    window.fetchcar = fetchcar;
    window.fetchfeatures = fetchfeatures;
    window.fetchbooking = fetchbooking;
    window.createbooking = createbooking;
    
    ReactDOM.render(<Root store={store}/>, root);
})