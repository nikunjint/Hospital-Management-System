import React from 'react';
import { View, StatusBar, TouchableOpacity, Image, Alert } from 'react-native';
import { Divider, Text, Input, Button, Icon } from 'react-native-elements';
import Utils  from '../modules/Utils';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_EMAIL, STORAGE_PASS } from '../modules/Environment';

export default class LoginScreen extends React.Component{
    state = {
        spinnerTitle: "loading..",
        spinner: false,
        email: "",
        password: "",
        isAutoLogin: true,
    }

    componentDidMount(){
        const t = "PATIENT";
        if(t=="ADMIN") this.setState({email: "admin@admin.com", password: "123456789"});
        if(t=="DOCTOR") this.setState({email: "abc@gmail.com", password: "987654321"});
        if(t=="PATIENT") this.setState({email: "patient@gmail.com", password: "123456789"});

        if(this.state.isAutoLogin){ this.setState({spinner:true, spinnerTitle: "processing.."}); this.autoLogin(); }
    }

    autoLogin = async() => {
        try{
            const email = await AsyncStorage.getItem(STORAGE_EMAIL);
            const pass = await AsyncStorage.getItem(STORAGE_PASS);
            if(email != null && pass != null && email != "" && pass != ""){
                this.setState({spinnerTitle: "logging in.."});
                const url = Utils.serverUrl() + "login-user?email=" + email + "&password=" + pass;
                const response = await fetch(url);
                const json = await response.json();
                if(json.status == 200){
                    try{
                        const data = { id: json.content._id, fullname: json.content.fullname, userType: json.content.type };
                        this.props.navigation.replace("DashboardScreen", data);
                    }
                    catch(e){
                        this.setState({spinner:false});
                        console.error(e);
                    }
                }
                else{
                    this.setState({spinner:false});
                }
            }
            else{
                this.setState({spinner:false});
            }
        }
        catch(error){
            console.error(error);
            this.setState({spinner:false});
        }
    }

    login = async() => {
        try{
            if(this.state.email.trim() == "" && this.state.password == ""){ Alert.alert("Error", "Please fill login form correctly."); return; }
            this.setState({spinner:true, spinnerTitle: "logging in.."});
            const url = Utils.serverUrl() + "login-user?email=" + this.state.email + "&password=" + this.state.password;
            const response = await fetch(url);
            const json = await response.json();
            if(json.status == 200){
                try{
                    await AsyncStorage.setItem(STORAGE_EMAIL, this.state.email.trim());
                    await AsyncStorage.setItem(STORAGE_PASS, this.state.password);

                    const data = { id: json.content._id, fullname: json.content.fullname, userType: json.content.type };
                    this.props.navigation.replace("DashboardScreen", data);
                }
                catch(e){
                    console.error(e);
                }
            }
            else Alert.alert("Error", json.content);
            this.setState({spinner:false});
        }
        catch(error){
            console.error(error);
        }
    }

    render(){
        return(
            <View style={{ flex:1 }}>
                <StatusBar barStyle="dark-content" backgroundColor="#fff" />
                {
                    this.state.spinner?
                        <Spinner visible={this.state.spinner} overlayColor="#3578e5" textContent={this.state.spinnerTitle} textStyle={{color: '#FFF'}}/>
                    :
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Image source={ require("../assets/logo.png")} style={{ width:148, height:148 }}/>
                            <Text style={{ fontSize:20, color:"#4267b2", marginTop:10 }}>Hospital Management System</Text>
                            <View style={{ margin:10, padding:10, alignSelf:"stretch" }}>
                                <Input autoCompleteType="email" placeholder='Enter your email' onChangeText={(v)=>{ this.setState({email:v}) }} value={this.state.email}  leftIcon={<Icon type='material-community' name="email" size={20} color='#4267b2'/>} />
                                <Input placeholder='Enter your password' onChangeText={(v)=>{ this.setState({password:v}) }} secureTextEntry value={this.state.password} leftIcon={<Icon type='material-community' name="key" size={20} color='#4267b2'/>} />
                                <Button icon={{ name:"lock", type:"feather",size:20, color:"white" }} title="Login" containerStyle={{ margin:10 }} onPress={()=> this.login()}/>
                            </View>
                            <View style={{ alignItems:"center", flexDirection:"row"}}>
                                <TouchableOpacity activeOpacity={0.7} onPress={ ()=>this.props.navigation.navigate("ForgotPasswordScreen") }>
                                    <Text style={{ fontSize:12, color:"#4267b2", marginTop:10 }}>Forgot Password</Text>
                                </TouchableOpacity>
                                <Divider style={{ width:20, backgroundColor:"transparent" }} />
                                <TouchableOpacity activeOpacity={0.7} onPress={()=>{ this.props.navigation.navigate("RegisterScreen"); }} >
                                    <Text style={{ fontSize:12, color:"#4267b2", marginTop:10 }}>Register As New Patient</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ alignItems:"center", flexDirection:"row", marginTop:30}}>
                                <TouchableOpacity activeOpacity={0.7} onPress={ ()=> { Utils.handleUrl("https://www.google.com"); }}>
                                    <Text style={{ fontSize:12, color:"#4267b2", marginTop:10 }}>Privacy &amp; Policy</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                }
            </View>
        );
    }
}