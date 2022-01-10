import React from 'react';
import { View, StatusBar, ScrollView, Alert } from 'react-native';
import { Text, Button, Divider, Input, Card } from 'react-native-elements';
import Utils  from '../modules/Utils';
import Toast from 'react-native-simple-toast';

export default class AdminAmbulanceServiceMakerScreen extends React.Component{
    state = {
        spinnerTitle: "loading..",
        spinner: false,
        refreshing:false,

        serviceName: "",
        phone: "",
        mobile: "",
        email: "",
        website: "https://",
    }

    save = async() => {
        try{
            if(this.state.serviceName == "" || this.state.phone == ""){ Toast.show("Fill form correctly!"); return; }
            this.setState({ refreshing:true, spinner:true, spinnerTitle: "saving bed info.."});
            const url = Utils.serverUrl() + "add-ambulance-service?service_name="+ this.state.serviceName + "&phone=" + this.state.phone+ "&mobile=" + this.state.mobile + "&email=" + this.state.email+ "&website=" + this.state.website;
            const response = await fetch(url);
            const json = await response.json();
            if(json.status == 200){ this.setState({serviceName:"", phone:"", mobile:"", email:"", website:""}); Alert.alert("Info", json.content); }
            else Alert.alert("Error", json.content);
            this.setState({spinner:false, refreshing:false});
        }
        catch(error){
            this.setState({spinner:false});
            console.error(error);
        }
    }

    render(){
        return(
            <View style={{ flex:1 }}>
                <StatusBar barStyle="dark-content" backgroundColor="#fff" />
                {
                    this.state.refreshing?
                        <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
                            <Text>{this.state.spinnerTitle}</Text>
                        </View>
                    :
                        <ScrollView style={{ flex: 1, backgroundColor:"#fff" }}>
                            <Card style={{ alignSelf:"stretch", marginBottom:20 }}>
                                <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5", marginTop:8 }}>Service Name *</Text>
                                <Input placeholder='Enter service name' onChangeText={(v)=>{ this.setState({serviceName:v}) }} value={this.state.serviceName}/>
                                <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5", marginTop:8 }}>Phone *</Text>
                                <Input keyboardType="number-pad" placeholder='Enter phone no.' onChangeText={(v)=>{ this.setState({phone:v}) }} value={this.state.phone}/>
                                <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5", marginTop:8 }}>Mobile</Text>
                                <Input keyboardType="number-pad" placeholder='Enter mobile no.' onChangeText={(v)=>{ this.setState({mobile:v}) }} value={this.state.mobile}/>
                                <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5", marginTop:8 }}>Email</Text>
                                <Input keyboardType="email-address" placeholder='Enter email' onChangeText={(v)=>{ this.setState({email:v}) }} value={this.state.email}/>
                                <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5", marginTop:8 }}>Website</Text>
                                <Input keyboardType="web-search" placeholder='Enter website (eg. https://abcdef.com)' onChangeText={(v)=>{ this.setState({website:v}) }} value={this.state.website}/>
                                <Divider style={{ height:20, backgroundColor:"#fff" }} />
                                <Button icon={{ type:"feather", name:"save", size:20, color:"white" }} containerStyle={{ padding: 5 }} title="Save" onPress={()=> this.save()}/>
                            </Card>
                        </ScrollView>
                }
            </View>
        );
    }
}