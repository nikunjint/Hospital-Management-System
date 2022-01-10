import React from 'react';
import { View, StatusBar, ScrollView, RefreshControl, Alert } from 'react-native';
import { Text, Input, Button, Icon, Card, Divider, Image} from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import Utils  from '../modules/Utils';
import * as ImagePicker from 'expo-image-picker';

export default class MyProfileInformationScreen extends React.Component{
    state = {
        spinnerTitle: "loading..",
        spinner: false,
        refreshing: false,

        prefix: "",
        name:"",
        email: "",
        sex: "",
        blood: "A+",
        phone: "",
        address: "",
        department: "",
        photo: "",
        base64Img:"",
        academic: "",
        charge: "",

        oldpass: "",
        newpass: "",
        repass: "",

        departmentList: Utils.getDepartment()
    }

    componentDidMount(){
        this.loadUserInfo();
    }

    loadUserInfo = async() => {
        try{
            this.setState({spinner:true, spinnerTitle:"loading profile info..", refreshing:true});
            const url = Utils.serverUrl() + "user-info?_id=" + global.id;
            const response = await fetch(url);
            const json = await response.json();
            if(json.status == 200){
                const data = json.content;
                this.setState({ 
                    id: data._id, academic: data.academic, address: data.address, blood: data.blood, department: data.department, email: data.email, 
                    name: data.fullname, sex: data.gender, phone: data.phone, photo: data.photo, prefix: data.prefix, charge: data.charge + "",
                });
            }
            else Alert.alert("Error", json.content);
            this.setState({spinner:false, refreshing:false});
        }
        catch(error){
            console.error(error);
        }
    }

    myProfile = () => {
        if(global.userType == "ADMIN" || global.userType == "PATIENT") return this.adminUserProfile();
        else if(global.userType == "DOCTOR") return this.doctorProfile();
        else return null;
    }

    openImagePicker = async() => {
        let result = await ImagePicker.launchImageLibraryAsync({allowsEditing: true, aspect: [4, 3], base64: true });
        if(!result.cancelled){ 
            this.setState({photo: result.uri, base64Img: `data:image/jpg;base64,${result.base64}`}); 
        }
    }

    adminUserProfile = () => {
        return(
            <View style={{alignSelf:"stretch", marginBottom:20 }}>
                <Card style={{flex:1}}>
                    <Text style={{ marginLeft:10, fontSize:20, color:"#3578e5", fontWeight:"bold" }}>Profile Information</Text>
                    <View style={{ flex:1, alignContent:"center", justifyContent:"center", flexDirection:"row", margin:15 }}>
                        { 
                            this.state.photo != ""?
                                <Image source={{ uri:this.state.photo }} err style={{ width:200, height:200 }}/> 
                            :
                                <Image source={ require("../assets/icons/image-not-found.png") } style={{ width:200, height:200 }}/> 
                        }
                    </View>
                    <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5" }}>Name</Text>
                    <Input placeholder='Enter your full name' onChangeText={(v)=>{ this.setState({name:v}) }} value={this.state.name}  leftIcon={<Icon type='feather' name="user" size={20} color='#4267b2'/>} />
                    <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5" }}>Biological Gender</Text>
                    <Picker selectedValue={this.state.sex} style={{height:50}} onValueChange={(v,i)=>{ this.setState({sex:v}); }}>
                        <Picker.Item label="Male" value="Male"/>
                        <Picker.Item label="Fe-Male" value="Female"/>
                    </Picker>
                    <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5", marginTop:8 }}>Blood Group</Text>
                    <Picker selectedValue={this.state.blood} style={{height:50}} onValueChange={(v,i)=>{ this.setState({blood:v}); }}>
                        <Picker.Item label="A+" value="A"/>
                        <Picker.Item label="A-" value="A-"/>
                        <Picker.Item label="B+" value="B"/>
                        <Picker.Item label="B-" value="B-"/>
                        <Picker.Item label="AB+" value="AB"/>
                        <Picker.Item label="AB-" value="AB-"/>
                        <Picker.Item label="O+" value="O"/>
                        <Picker.Item label="O-" value="O-"/>
                    </Picker>
                    <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5" }}>Photo</Text>
                    <Text style={{ marginLeft:10, fontSize:18, color:"#000", backgroundColor:"#e3e3e3", padding:8 }} onPress={()=>this.openImagePicker()} >Browse Image {this.state.photo!=""?<Text style={{ fontSize:12, color:"red", }}>Image selected</Text>:null}</Text>

                    <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5", marginTop:8 }}>Phone No.</Text>
                    <Input placeholder='Enter your phone number' onChangeText={(v)=>{ this.setState({phone:v}) }} value={this.state.phone} leftIcon={<Icon type='material-community' name="phone-classic" size={20} color='#4267b2'/>} />
                    <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5" }}>Address</Text>
                    <Input placeholder='Enter your current address' onChangeText={(v)=>{ this.setState({address:v}) }} value={this.state.address} leftIcon={<Icon type='entypo' name="address" size={20} color='#4267b2'/>} />
                    <Button title="Update Profile" onPress={() => this.updateUserInfo()} />
                </Card>
            </View>
        );
    }

    doctorProfile = () => {
        return(
            <View style={{ alignSelf:"stretch", marginBottom:20 }}>
                <Card style={{flex:1}}>
                    <Text style={{ marginLeft:10, fontSize:20, color:"#3578e5", fontWeight:"bold" }}>Profile Information</Text>
                    <View style={{ flex:1, alignContent:"center", justifyContent:"center", flexDirection:"row", margin:15 }}>
                        { 
                            this.state.photo != ""?
                                <Image source={{ uri:this.state.photo }} err style={{ width:200, height:200 }}/> 
                            :
                                <Image source={ require("../assets/icons/image-not-found.png") } style={{ width:200, height:200 }}/> 
                        }
                    </View>
                    <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5" }}>Prefix</Text>
                    <Picker selectedValue={this.state.prefix} style={{height:50}} onValueChange={(v,i)=>{ this.setState({prefix:v}); }}>
                        <Picker.Item label="Mr." value="Mr."/>
                        <Picker.Item label="Mrs." value="Mrs."/>
                        <Picker.Item label="Miss." value="Miss."/>
                        <Picker.Item label="Ms." value="Ms."/>
                        <Picker.Item label="Mx." value="Mx."/>
                        <Picker.Item label="Dr." value="Dr."/>
                        <Picker.Item label="Prof." value="Prof."/>
                    </Picker>
                    <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5" }}>Full Name</Text>
                    <Input placeholder='Enter your full name' onChangeText={(v)=>{ this.setState({name:v}) }} value={this.state.name}  leftIcon={<Icon type='feather' name="user" size={20} color='#4267b2'/>} />
                    <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5" }}>Biological Gender</Text>
                    <Picker selectedValue={this.state.sex} style={{height:50}} onValueChange={(v,i)=>{ this.setState({sex:v}); }}>
                        <Picker.Item label="Male" value="Male"/>
                        <Picker.Item label="Fe-Male" value="Female"/>
                    </Picker>
                    <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5", marginTop:8 }}>Blood Group</Text>
                    <Picker selectedValue={this.state.blood} style={{height:50}} onValueChange={(v,i)=>{ this.setState({sex:v}); }}>
                        <Picker.Item label="A+" value="A+"/>
                        <Picker.Item label="A-" value="A-"/>
                        <Picker.Item label="B+" value="B+"/>
                        <Picker.Item label="B-" value="B-"/>
                        <Picker.Item label="AB+" value="AB+"/>
                        <Picker.Item label="AB-" value="AB-"/>
                        <Picker.Item label="O+" value="O+"/>
                        <Picker.Item label="O-" value="O-"/>
                    </Picker>
                    <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5", marginTop:8 }}>Phone No.</Text>
                    <Input placeholder='Enter your phone number' onChangeText={(v)=>{ this.setState({phone:v}) }} value={this.state.phone} leftIcon={<Icon type='material-community' name="phone-classic" size={20} color='#4267b2'/>} />
                    <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5" }}>Address</Text>
                    <Input placeholder='Enter your current address' onChangeText={(v)=>{ this.setState({address:v}) }} value={this.state.address} leftIcon={<Icon type='entypo' name="address" size={20} color='#4267b2'/>} />
                    <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5" }}>Department</Text>
                    <Picker selectedValue={this.state.department} style={{height:50}} onValueChange={(v,i)=>{ this.setState({department:v}); }}>
                        {
                            this.state.departmentList.map((val, i) => {
                                return(<Picker.Item key={i.toString()} label={val} value={val}/>);
                            })
                        }
                    </Picker>
                    
                    <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5" }}>Photo</Text>
                    <Text style={{ marginLeft:10, fontSize:18, color:"#000", backgroundColor:"#e3e3e3", padding:8 }} onPress={()=>this.openImagePicker()} >Browse Image {this.state.photo!=""?<Text style={{ fontSize:12, color:"red", }}>Image selected</Text>:null}</Text>

                    <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5" }}>Academic</Text>
                    <Input placeholder='Enter your current academic qualification' onChangeText={(v)=>{ this.setState({academic:v}) }} value={this.state.academic} leftIcon={<Icon type='ionicon' name="school" size={20} color='#4267b2'/>} />

                    <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5" }}>Charge Per Appointment</Text>
                    <Input placeholder='Enter charge per appointment' onChangeText={(v)=>{ this.setState({charge:v}) }} value={this.state.charge} leftIcon={<Icon type='material-community' name="cash" size={20} color='#4267b2'/>} />
                    <Button title="Update" onPress={() => this.updateUserInfo()} />
                </Card>
            </View>
        );
    }

    updateUserInfo = async() => {
        if(global.userType == "ADMIN" || global.userType == "PATIENT"){
            try{
                if(this.state.name == ""|| this.state.sex == "" || this.state.blood == ""|| this.state.photo == ""|| this.state.phone == ""|| this.state.address == ""){
                    Alert.alert("Error", "Please fill all the form correctly.");
                    return;
                }
                this.setState({refreshing:true, spinner:true, spinnerTitle:"updating profile info.."});
                const url = Utils.serverUrl() + "update-patient";
                const body = JSON.stringify({ fullname: this.state.name, email: this.state.email, password: this.state.pass, gender: this.state.sex, blood: this.state.blood,
                                              phone: this.state.phone, address: this.state.address, photo: this.state.base64Img, _id: global.id });
                const response = await fetch(url, {
                    method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
                    body: body
                });
                const json = await response.json();
                if(json.status == 200)Alert.alert("Info", json.content);
                else Alert.alert("Error", json.content);
                this.setState({spinner:false, refreshing:false });
            }
            catch(error){
                console.error(error);
            }
        }
        else if(global.userType == "DOCTOR"){
            try{
                if(this.state.prefix == "" || this.state.name == "" || this.state.sex == "" || this.state.blood == "" || this.state.phone == "" || this.state.address == "" || this.state.photo == "" || this.state.department == "" || this.state.academic == ""){
                    Alert.alert("Error", "Please fill all the form correctly.")
                    return;
                }

                this.setState({refreshing: true, spinner: true, spinnerTitle: "updating profile info.."});
                const url = Utils.serverUrl() + "update-doctor";
                const body = JSON.stringify({ prefix:this.state.prefix, department: this.state.department, charge: this.state.charge, academic: this.state.academic, 
                                            fullname: this.state.name, email: this.state.email, password: this.state.pass, gender: this.state.sex, blood: this.state.blood,
                                            phone: this.state.phone, address: this.state.address, photo: this.state.base64Img, _id: global.id });
                const response = await fetch(url, {
                    method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
                    body: body
                });
                const json = await response.json();
                if(json.status == 200) Alert.alert("Info", json.content);
                else Alert.alert("Error", json.content);
                this.setState({spinner:false, refreshing:false});
            }
            catch(error){
                console.error(error);
            }
        }
    }

    updatePasswordInfo = async() => {
        try{
            if(this.state.oldpass == ""|| this.state.newpass == ""){
                if(this.state.repass != this.state.newpass){ Alert.alert("Error", "Retype password doesnot match."); return; }
                Alert.alert("Error", "Please fill all the form correctly.");
                return;
            }

            this.setState({refreshing:true, spinner:true, spinnerTitle:"updating password.."});
            const url = Utils.serverUrl() + "user-update-pass?_id="+ global.id + "&password=" + this.state.oldpass + "&newpassword=" + this.state.newpass;
            const response = await fetch(url);
            const json = await response.json();
            if(json.status == 200){
                this.setState({oldpass:"", newpass: ""});
                Alert.alert("Info", json.content);
            }
            else Alert.alert("Error", json.content);
            this.setState({spinner:false, refreshing:false });
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
                    this.state.refreshing?
                        <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
                            <Text>{this.state.spinnerTitle}</Text>
                        </View>
                    :
                        <ScrollView refreshControl={ <RefreshControl refreshing={this.state.refreshing} onRefresh={this.loadUserInfo}/> } style={{ flex: 1, backgroundColor:"#fff", paddingBottom:20 }}>
                            <View>
                                { this.myProfile() }
                                <Card style={{flex:1}}>
                                    <Text style={{ marginTop:20, marginLeft:10, fontSize:20, color:"#3578e5", fontWeight:"bold" }}>Update Password</Text>
                                    <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5" }}>Email</Text>
                                    <Input disabled value={this.state.email}  leftIcon={<Icon type='material-community' name="email" size={20} color='#4267b2'/>} />
                                    <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5" }}>Old Password</Text>
                                    <Input placeholder='Enter your password' onChangeText={(v)=>{ this.setState({oldpass:v}) }} secureTextEntry value={this.state.oldpass} leftIcon={<Icon type='material-community' name="key" size={20} color='#4267b2'/>} />
                                    <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5" }}>New Password</Text>
                                    <Input placeholder='Re-type password' onChangeText={(v)=>{ this.setState({newpass:v}) }} secureTextEntry value={this.state.newpass} leftIcon={<Icon type='material-community' name="key" size={20} color='#4267b2'/>} />
                                    <Button title="Update Password" onPress={() => this.updatePasswordInfo()} />
                                </Card>
                                <Divider style={{ height:30, backgroundColor:"#fff" }} />
                            </View>
                        </ScrollView>
                }
            </View>
        );
    }
}