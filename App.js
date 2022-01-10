import React from 'react';
import Route from './routes/Route';

export default class App extends React.Component{
  render(){
    if(this.props.isHeadless){ return null; } //only for iOS
    return(<Route/>);
  }
}