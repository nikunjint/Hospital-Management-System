import React from 'react';
import { View, StatusBar, ScrollView, Alert } from 'react-native';
import { Text, Input, Button, Icon} from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import Utils from '../modules/Utils';
import * as ImagePicker from 'expo-image-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default class RegisterScreen extends React.Component{
    state = {
        spinnerTitle: "loading..",
        spinner: false,
        
        name:"",
        email: "",
        pass: "",
        repass: "",
        sex: "Male",
        blood: "A+",
        phone: "",
        address: "",
        photo: "",
        base64Img: "",

        dob: new Date(Date.now()),
        dobVisible: false,
    }

    register = async() => {
        try{
            if(this.state.name == ""|| this.state.email == ""|| this.state.pass == ""|| this.state.repass == ""|| this.state.sex == "" || this.state.blood == ""|| this.state.phone == ""|| this.state.address == ""|| this.state.photo == ""){
                if(this.state.pass != this.state.repass){
                    Alert.alert("Error", "Password and Re-type password doesnot match.")
                    return;
                }
                Alert.alert("Error", "Please fill all the form correctly.")
                return;
            }
            this.setState({spinner:true, spinnerTitle:"registering new patient.."});
            const url = Utils.serverUrl() + "create-patient";
            const body = JSON.stringify({ fullname: this.state.name, email: this.state.email, dob: this.state.dob, password: this.state.pass, gender: this.state.sex, blood: this.state.blood, phone: this.state.phone, address: this.state.address, photo: this.state.base64Img });
            const response = await fetch(url, {
                method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
                body: body
            });

            const json = await response.json();
            if(json.status == 200) Alert.alert("Info", json.content);
            else Alert.alert("Error", json.content);
            this.setState({spinner:false, name:"", email: "", pass: "", repass: "", sex: "Male", blood: "A+", phone: "", address: "", photo: "", base64Img: ""});
        }
        catch(error){
            console.error(error);
        }
    }

    openImagePicker = async() => {
        let result = await ImagePicker.launchImageLibraryAsync({allowsEditing: true, aspect: [4, 3], base64: true });
        if(!result.cancelled){ 
            this.setState({photo: result.uri, base64Img: `data:image/jpg;base64,${result.base64}`}); 
        }
    }

    render(){
        return(
            <View style={{ flex:1 }}>
                <StatusBar barStyle="dark-content" backgroundColor="#fff" />
                <DateTimePickerModal testID="dob" mode="date" isVisible={this.state.dobVisible} onConfirm={date => this.setState({dob:date, dobVisible:true})} onCancel={()=>{ this.setState({dobVisible:false}) }}/>
                {
                    this.state.spinner?
                        <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
                            <Text>{this.state.spinnerTitle}</Text>
                        </View>
                    :
                        <ScrollView style={{ flex: 1, backgroundColor:"#fff" }}>
                            <View style={{ margin:10, padding:10, alignSelf:"stretch", marginBottom:20 }}>
                            <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5" }}>Name</Text>
                                <Input placeholder='Enter your full name' onChangeText={(v)=>{ this.setState({name:v}) }} value={this.state.name}  leftIcon={<Icon type='feather' name="user" size={20} color='#4267b2'/>} />
                                <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5" }}>Email</Text>
                                <Input placeholder='Enter your email' onChangeText={(v)=>{ this.setState({email:v}) }} value={this.state.email}  leftIcon={<Icon type='material-community' name="email" size={20} color='#4267b2'/>} />
                                <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5" }}>Password</Text>
                                <Input placeholder='Enter your password' onChangeText={(v)=>{ this.setState({pass:v}) }} secureTextEntry value={this.state.pass} leftIcon={<Icon type='material-community' name="key" size={20} color='#4267b2'/>} />
                                <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5" }}>Re-Password</Text>
                                <Input placeholder='Re-type password' onChangeText={(v)=>{ this.setState({repass:v}) }} secureTextEntry value={this.state.repass} leftIcon={<Icon type='material-community' name="key" size={20} color='#4267b2'/>} />

                                <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5" }}>Date Of Birth</Text>
                                <Text style={{ fontSize:18, color:"#000", backgroundColor:"#e3e3e3", padding:8 }} onPress={() => this.setState({dobVisible:true})} >{this.state.dob.toLocaleDateString("en-US")}</Text>

                                <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5" }}>Biological Gender</Text>
                                <Picker selectedValue={this.state.sex} style={{height:50}} onValueChange={(v,i)=>{ this.setState({sex:v}); }} style={{ backgroundColor:"#f4f4f4" }}>
                                    <Picker.Item label="Male" value="Male"/>
                                    <Picker.Item label="Fe-Male" value="Female"/>
                                </Picker>
                                
                                <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5", marginTop:8 }}>Blood Group</Text>
                                <Picker selectedValue={this.state.blood} style={{height:50}} onValueChange={(v,i)=>{ this.setState({blood:v}); }} style={{ backgroundColor:"#f4f4f4" }}>
                                    <Picker.Item label="A+" value="A+"/>
                                    <Picker.Item label="A-" value="A-"/>
                                    <Picker.Item label="B+" value="B+"/>
                                    <Picker.Item label="B-" value="B-"/>
                                    <Picker.Item label="AB+" value="AB+"/>
                                    <Picker.Item label="AB-" value="AB-"/>
                                    <Picker.Item label="O+" value="O+"/>
                                    <Picker.Item label="O-" value="O-"/>
                                </Picker>
                                
                                <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5" }}>Photo</Text>
                                <Text style={{ marginLeft:10, fontSize:18, color:"#000", backgroundColor:"#e3e3e3", padding:8 }} onPress={()=>this.openImagePicker()} >Browse Image {this.state.photo!=""?<Text style={{ fontSize:12, color:"red", }}>Image selected</Text>:null}</Text>

                                <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5", marginTop:8 }}>Phone No.</Text>
                                <Input placeholder='Enter your phone number' onChangeText={(v)=>{ this.setState({phone:v}) }} value={this.state.phone} leftIcon={<Icon type='material-community' name="phone-classic" size={20} color='#4267b2'/>} />
                                <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5" }}>Address</Text>
                                <Input placeholder='Enter your current address' onChangeText={(v)=>{ this.setState({address:v}) }} value={this.state.address} leftIcon={<Icon type='entypo' name="address" size={20} color='#4267b2'/>} />
                                <Button title="Submit" onPress={() => this.register()} />
                            </View>
                        </ScrollView>
                }
            </View>
        );
    }
}