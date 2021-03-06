import React from 'react';
import { Link } from 'react-router-dom';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { times, parseTime, defaultTime, formatDate } from '../util/date_util';

class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.handleLocationChange = this.handleLocationChange.bind(this);
        this.handleStartDayChange = this.handleStartDayChange.bind(this);
        this.handleEndDayChange = this.handleEndDayChange.bind(this);
        this.handleTimeSelect = this.handleTimeSelect.bind(this);
        this.state = {
            startDate: undefined,
            endDate: undefined
        }
    }

    componentDidMount() {
        const searchbox = document.getElementById('index-nav-where')
        if (searchbox){
            this.autocomplete = new google.maps.places.Autocomplete(searchbox);
            this.autocomplete.addListener('place_changed', this.handleLocationChange)
        }

        if(!this.state.startDate || !this.state.endDate) {
            const startDate = new Date(sessionStorage.getItem('startdate'));
            const endDate = new Date(sessionStorage.getItem('enddate'));
            
            this.setState({ startDate: startDate, endDate: endDate }, () => {
                this.props.updatefilter('dates', this.state)
            });
        }
    }

    componentDidUpdate(prevProps) {
       
        if (this.props.location.pathname.includes("/cars") && (this.props.location.pathname !== prevProps.location.pathname)) {
            const searchbox = document.getElementById('index-nav-where')
            
            if (searchbox) {
                this.autocomplete = new google.maps.places.Autocomplete(searchbox);
                this.autocomplete.addListener('place_changed', this.handleLocationChange)
            }
           //this setState causes a bug
            this.setState({ startDate: this.props.dates.startDate, endDate: this.props.dates.endDate})
           
        }

    }

    handleStartDayChange(selectedDay) {
        const hours = this.state.startDate.getHours();
        const minutes = this.state.startDate.getMinutes();
        
        selectedDay.setHours(hours);
        selectedDay.setMinutes(minutes);

        if (selectedDay < this.state.endDate) {
            this.setState({ startDate: selectedDay }, () => {
                sessionStorage.setItem('startdate', this.state.startDate.toString());
                this.props.updatefilter("dates", this.state);
            })
        } else {
            this.setState({ startDate: selectedDay }, () => {
                sessionStorage.setItem('startdate', this.state.startDate.toString());
            })
            const dayAfter = new Date(selectedDay.getTime());
            dayAfter.setDate(dayAfter.getDate() + 1);
            this.setState({ endDate: dayAfter }, () => {
                sessionStorage.setItem('enddate', this.state.endDate.toString());
                this.props.updatefilter("dates", this.state);
            })
        }
    }

    handleEndDayChange(selectedDay) {
        const hours = this.state.endDate.getHours();
        const minutes = this.state.endDate.getMinutes();
    
        selectedDay.setHours(hours);
        selectedDay.setMinutes(minutes);

        if (selectedDay < this.state.startDate) {
            this.setState({ startDate: selectedDay}), () => {
                sessionStorage.setItem('startdate', this.state.startDate.toString());
            };
            const dayAfter = new Date(selectedDay.getTime());
            dayAfter.setDate(dayAfter.getDate() + 1);
            this.setState({ endDate: dayAfter }, () => {
                sessionStorage.setItem('enddate', this.state.endDate.toString());
                this.props.updatefilter("dates", this.state);
            })
        } else {
            this.setState({ endDate: selectedDay }, () => {
                sessionStorage.setItem('enddate', this.state.endDate.toString());
                this.props.updatefilter("dates", this.state);
            });
        }
    }

    handleTimeSelect(selectedDate, e) {
        const time = parseTime(e.target.value);
        const hours = time[0];
        const minutes = time[1];
        let newDate;

        if (selectedDate === 'from') {
            newDate = this.state.startDate
            newDate.setHours(hours, minutes);
            this.setState({ startDate: newDate }, () => {
                sessionStorage.setItem('startdate', this.state.startDate.toString());
                this.props.updateFilter("dates", { startDate: this.state.startDate, endDate: this.state.endDate });
            })
        } else {
            newDate = this.state.endDate
            newDate.setHours(hours, minutes);
            this.setState({ endDate: newDate }, () => {
                sessionStorage.setItem('enddate', this.state.endDate.toString());
                this.props.updateFilter("dates", { startDate: this.state.startDate, endDate: this.state.endDate });
            })
        }
    }

    handleLocationChange() {
        const place = this.autocomplete.getPlace().geometry.location;
        const lat = place.lat();
        const lng = place.lng();
        const center = { center: { lat, lng } }
        sessionStorage.setItem('lat', lat)
        sessionStorage.setItem('lng', lng)
        this.props.locationFilter(center);
        if (this.props.location.pathname.includes('/cars/')) {
            this.props.history.push("/cars");
        }
    }

    render() {
        if (this.props.location.pathname == '/cars') {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);

            const disabled = {
                before: tomorrow
            }
            const selectedDays = {
                from: this.state.startDate,
                to: this.state.endDate
            }
          
            return (
                <>
                <nav className="car-index-nav-bar">
                    <form className="car-index-nav-search" >
                        <Link className="logo" to="/"><img src={window.logoURL} alt="Suro" /></Link>   
                        
                            <div className="index-where"> 
                                <p>Where</p>
                                <label htmlFor="index-nav-where"></label>
                                <input type="text" id="index-nav-where" placeholder="Map location" />
                            </div>
                            <div className="index-from">
                                <p>From</p>
                                <label htmlFor="index-nav-from-date"></label>
                                <DayPickerInput
                                    value={formatDate(this.state.startDate)}
                                    dayPickerProps={{
                                        disabledDays: disabled,
                                        selectedDays: selectedDays
                                    }}
                                    onDayChange={this.handleStartDayChange}
                                />
                                <i className="fas fa-angle-down"></i>
                                <label htmlFor="index-nav-from-time"></label>
                                <select id="index-nav-from-time" value={defaultTime(this.state.startDate)} onChange={(e) => this.handleTimeSelect('from', e)}>
                                    {times.map((time, idx) => {
                                        return <option value={time} key={idx}>{time}</option>
                                    })}
                                </select>
                                <i className="fas fa-angle-down"></i>
                            </div>
                            <div className="index-until">
                                <p>Until</p>
                                <label htmlFor="index-nav-until-date"> </label>
                                <DayPickerInput
                                    value={formatDate(this.state.endDate)}
                                    dayPickerProps={{
                                        disabledDays: disabled,
                                        selectedDays: selectedDays
                                    }}
                                    onDayChange={this.handleEndDayChange}
                                />
                                <i className="fas fa-angle-down"></i>
                                <label htmlFor="index-nav-until-time"></label>
                                <select id="index-nav-until-time" value={defaultTime(this.state.endDate)} onChange={(e) => this.handleTimeSelect('until', e)}>
                                    {times.map((time, idx) => {
                                        return <option value={time} key={idx}>{time}</option>
                                    })}
                                </select>
                                <i className="fas fa-angle-down"></i>
                            </div>
                        
                    </form>
                        <div id="index-dd-trigger">
                            <i className="far fa-user-circle fa-2x"></i>
                            <ul className="car-index-nav-dd">
                                { this.props.currentUser ?
                                <>
                                    <li>Host</li>
                                    <li>Trips</li>
                                    <li>Account</li>
                                    <li>Profile</li>
                                    <li>Favorites</li>
                                    <li>Carculator</li>
                                    <li>Host tools</li>
                                    <li>Get help</li>
                                    <li onClick={() => this.props.logout(this.props.currentUser.id)}>Log out</li>
                                </>
                                :
                                <>
                                    <li onClick={() => this.props.openModal('login')}>Log in</li>
                                    <li onClick={() => this.props.openModal('signup')}>Sign up</li>
                                    <li className="separator">How Suro works</li>
                                    <li>Insurance & protection</li>
                                    <li>Carculator</li>
                                    <li>Host tools</li>
                                    <li>Get help</li>
                                </>
                                }
                            </ul>
                        </div>
                </nav>
                <div className="index-nav-filters">
                    <button onClick={() => this.props.openModal('sort')}>Sort By</button>
                    <button>Price</button>
                    <button>Book Instantly</button>
                    <button>Delivery</button>
                    <button>Distance included</button>
                    <button><i className="fas fa-sliders-h"></i>More filters</button>
                </div>
                </>
            )
        }

        if (!this.props.currentUser) {
            
            return (
                <nav className={this.props.location.pathname.includes('/cars/') && !this.props.location.pathname.includes('checkout') ? "no-login-nav-bar sticky" : "no-login-nav-bar"}>
                    <div>
                        <Link className="logo" to="/"><img src={window.logoURL} alt="Suro"/></Link>
                        {this.props.location.pathname.includes('/cars/') ? 
                            <form className="show-where" onSubmit={this.handleSubmit}>
                                <i className="fas fa-search"></i> 
                                <label htmlFor="index-nav-where"></label>
                                <input type="text" id="index-nav-where" placeholder="City, airport, address, or hotel" />
                            </form> : "" }
                    </div>
                    <ul className="nav-ul">
                        <li><Link to="">List your car</Link></li>
                        <li className="nav-learn">
                            <div className="nav-learn-trigger-1">Learn more
                                <ul className="nav-learn-dropdown">
                                    <li><p>How Suro Works</p></li>
                                    <li><p>Insurance & protection</p></li>
                                    <li><p>Carculator</p></li>
                                    <li><p>Host tools</p></li>
                                </ul>
                            </div>
                        </li>
                        <li className="modal" onClick={() => this.props.openModal('login')}>Log in</li>
                        <li className="modal" onClick={() => this.props.openModal('signup')}>Sign up</li>
                        <i className="far fa-user-circle fa-2x"></i>
                    </ul>
        
                </nav>
            )
        } else {
            return (
                <nav className={this.props.location.pathname.includes('/cars/') && !this.props.location.pathname.includes('checkout') ? "login-nav-bar sticky" : "login-nav-bar"}>
                    <div>
                        <Link className="logo" to="/"><img src={window.logoURL} alt="Suro" /></Link>
                        {this.props.location.pathname.includes('/cars/') ?
                            <form className="show-where" onClick={this.handleSubmit}>
                                <i className="fas fa-search"></i>
                                <label htmlFor="index-nav-where"></label>
                                <input type="text" id="index-nav-where" placeholder="City, airport, address, or hotel"/>
                            </form> : ""}
                    </div>
                    <ul className="nav-ul">
                        <li><Link to="">List your car</Link></li>
                        <li>
                                <div className="nav-learn-trigger">Learn more
                                    <ul className="nav-learn-dropdown">
                                        <li><p>How Suro Works</p></li>
                                        <li><p>Insurance & protection</p></li>
                                        <li><p>Carculator</p></li>
                                        <li><p>Host tools</p></li>
                                    </ul>
                                </div>
                    
                        </li>
                        <li>
                            <div className="nav-trips-trigger">Trips
                                <ul className="nav-trips-dropdown">
                                    <li><p>Activity</p></li>
                                    <li><p>Booked</p></li>
                                    <li><p>History</p></li>
                                </ul>
                            </div>
                        </li>
                        <li><Link to="">Messages</Link></li>
                        <li > 
                            <div className="nav-user-trigger">
                                <i className="far fa-user-circle fa-2x"></i>
                                <ul className="nav-user-dd">
                                    <li><p>Profile</p></li>
                                    <li><p>Favorites</p></li>
                                    <li><p>List your car</p></li>
                                    <li><p>Account</p></li>
                                    <li><p>Contact support</p></li>
                                    <li onClick={() => this.props.logout(this.props.currentUser.id)}><p>Log out</p></li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </nav>
            )
        }
    }
}

export default NavBar;