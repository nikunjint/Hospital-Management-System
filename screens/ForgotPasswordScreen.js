import React from 'react';
import { View, StatusBar } from 'react-native';
import { Input, Button, Image, Icon } from 'react-native-elements';

export default class ResetPassword extends React.Component{
    state = {
        email: "",
    }

    resetPass = () => {

    }

    render(){
        return(
            <View style={{ flex:1 }}>
                <StatusBar barStyle="dark-content" backgroundColor="#fff" />
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Image source={ require("../assets/icon.png")} style={{ width:100, height:100 }}/>
                    <View style={{ margin:10, marginTop:30, padding:10, alignSelf:"stretch" }}>
                        <Input placeholder='Enter your email' onChangeText={(v)=>{ this.setState({email:v}) }} value={this.state.email}  leftIcon={<Icon type='material-community' name="email" size={20} color='#4267b2'/>} />
                        <Button title="Submit" containerStyle={{ margin:10 }} onPress={()=> this.resetPass()}/>
                    </View>
                </View>
            </View>
        );
    }
}