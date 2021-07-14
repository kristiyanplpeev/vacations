import React, { Component } from "react";

export interface AppProps { }

export interface AppState {
  loading: boolean;
  message: { id: string, name: string }[]
}

class Welcome extends Component<AppProps, AppState> {

  // async componentDidMount() {
  //   await this.ping();
  // }

  state = {
    message: [{ id: '', name: 'unknown' }],
    loading: false
  };

  render() {

    if(this.state.loading) {
      return <div> Loading... </div>
    }
    return <div>
      <button onClick={async () => await this.ping()}>Check server status:</button>
      
      {this.state.message.map(el => <div> Service status at: {this.getCurrentTime()}: {el.name}<br></br></div>)}
      </div>;
  }

  ping = async () => {
    this.setState({
      loading: true
    })
    try {
      const response = await fetch('http://localhost:5000/ping');
      const responseJSON = await response.json();
      this.setState(prevState => ({
        message: [...prevState.message, responseJSON[0]],
        loading: false
      }))
    } catch(err) {
      this.setState(prevState => ({
        message: [...prevState.message, { id: '', name: 'not ok' }],
        loading: false
      }))
    }
  }

  getCurrentTime = () => {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth()+1;
    const year = today.getFullYear();
    const hours = today.getHours();
    const minutes = today.getMinutes();
    const seconds = today.getSeconds();

    return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
  }
};

export default Welcome;
