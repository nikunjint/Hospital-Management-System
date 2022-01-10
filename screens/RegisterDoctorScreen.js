import React from 'react';
import { View, StatusBar, ScrollView, Alert } from 'react-native';
import { Text, Input, Button, Icon} from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import Spinner from 'react-native-loading-spinner-overlay';
import Utils from '../modules/Utils';
import * as ImagePicker from 'expo-image-picker';

export default class RegisterDoctorScreen extends React.Component{
    state = {
        spinnerTitle: "loading..",
        spinner: false,

        isEdit:false,

        id:"",

        prefix: "Mr.",
        name: "",
        email: "",
        pass: "",
        repass: "",
        sex: "Male",
        blood: "A",
        phone: "",
        address: "",
        department: "All Department",
        photo: "",
        base64Img: "",
        academic: "",
        charge: "0.00",

        departmentList: Utils.getDepartment(),
    }

    componentDidMount() {
        if(this.props.route.params){
            this.setState({
                id:this.props.route.params.id,
                prefix: this.props.route.params.prefix,
                name: this.props.route.params.name,
                email: this.props.route.params.email,
                sex: this.props.route.params.sex,
                blood: this.props.route.params.blood,
                phone: this.props.route.params.phone,
                address: this.props.route.params.address,
                department: this.props.route.params.department,
                base64Img: this.props.route.params.photo,
                academic: this.props.route.params.academic,
                charge: this.props.route.params.charge + "",
                isEdit:true,
            });

            if(this.props.route.params.photo != ""){ this.setState({photo:"OK"}); }
        }
    }

    register = async() => {
        try{
            if(this.state.prefix == "" || this.state.name == ""|| this.state.email == ""|| this.state.pass == ""|| this.state.repass == ""|| this.state.sex == "" || this.state.blood == ""
                || this.state.phone == ""|| this.state.address == "" || this.state.department == "All Department" || this.state.department == "" || this.state.photo == "" || this.state.academic == ""|| this.state.charge == ""){
                if(this.state.pass != this.state.repass){
                    Alert.alert("Error", "Password and Re-type password doesnot match.")
                    return;
                }
                Alert.alert("Error", "Please fill all the form correctly.")
                return;
            }

            this.setState({spinner:true, spinnerTitle:"registering new doctor.."});
            const url = Utils.serverUrl() + "create-doctor";
            const body = JSON.stringify({ prefix:this.state.prefix, department: this.state.department, charge: this.state.charge, academic: this.state.academic, 
                                        fullname: this.state.name, email: this.state.email, password: this.state.pass, gender: this.state.sex, blood: this.state.blood,
                                        phone: this.state.phone, address: this.state.address, photo: this.state.base64Img });
            const response = await fetch(url, {
                method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
                body: body
            });
            const json = await response.json();
            if(json.status == 200) Alert.alert("Info", json.content);
            else Alert.alert("Error", json.content);
            this.setState({spinner:false, prefix: "Mr.", name:"", email: "", pass: "", repass: "", sex: "Male", blood: "A+", phone: "", address: "", department: "", photo: "", academic: "", charge: ""});
        }
        catch(error){
            console.error(error);
        }
    }

    update = async() => {
        try{
            if(this.state.prefix == "" || this.state.name == ""|| this.state.sex == "" || this.state.blood == ""|| this.state.phone == ""|| this.state.address == ""|| this.state.photo == "" 
            || this.state.department == ""|| this.state.department == "All Department" || this.state.academic == "" || this.state.charge == ""){
                Alert.alert("Error", "Please fill all the form correctly.")
                return;
            }

            this.setState({spinner:true, spinnerTitle:"updating doctor info.."});
            const url = Utils.serverUrl() + "update-doctor";

            const body = JSON.stringify({ prefix:this.state.prefix, department: this.state.department, charge: this.state.charge, academic: this.state.academic, 
                                            fullname: this.state.name, email: this.state.email, password: this.state.pass, gender: this.state.sex, blood: this.state.blood,
                                            phone: this.state.phone, address: this.state.address, photo: this.state.base64Img, _id:this.state.id });
            const response = await fetch(url, {
                method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
                body: body
            });
            const json = await response.json();
            if(json.status == 200) Alert.alert("Info", json.content);
            else Alert.alert("Error", json.content);
            this.setState({spinner:false});
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
                <Spinner visible={this.state.spinner} overlayColor="#3578e5" textContent={this.state.spinnerTitle} textStyle={{color: '#FFF'}}/>
                <ScrollView style={{ flex: 1, backgroundColor:"#fff" }}>
                    <View style={{ margin:10, padding:10, alignSelf:"stretch", marginBottom:20 }}>
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
                        {
                            this.state.isEdit?
                                null
                            :
                                <View>
                                    <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5" }}>Email</Text>
                                    <Input placeholder='Enter your email' onChangeText={(v)=>{ this.setState({email:v}) }} value={this.state.email}  leftIcon={<Icon type='material-community' name="email" size={20} color='#4267b2'/>} />
                                </View>
                        }
                        {
                            (!this.state.isEdit)?
                                <View>
                                    <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5" }}>Password</Text>
                                    <Input placeholder='Enter your password' onChangeText={(v)=>{ this.setState({pass:v}) }} secureTextEntry value={this.state.pass} leftIcon={<Icon type='material-community' name="key" size={20} color='#4267b2'/>} />
                                    <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5" }}>Re-Password</Text>
                                    <Input placeholder='Re-type password' onChangeText={(v)=>{ this.setState({repass:v}) }} secureTextEntry value={this.state.repass} leftIcon={<Icon type='material-community' name="key" size={20} color='#4267b2'/>} />
                                </View>
                            :
                                null
                        }
                        <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5" }}>Biological Gender</Text>
                        <Picker selectedValue={this.state.sex} style={{height:50}} onValueChange={(v,i)=>{ this.setState({sex:v}); }}>
                            <Picker.Item label="Male" value="Male"/>
                            <Picker.Item label="Fe-Male" value="Female"/>
                        </Picker>
                        <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5", marginTop:8 }}>Blood Group</Text>
                        <Picker selectedValue={this.state.blood} style={{height:50}} onValueChange={(v,i)=>{ this.setState({blood:v}); }}>
                            <Picker.Item label="A" value="A"/>
                            <Picker.Item label="A-" value="A-"/>
                            <Picker.Item label="B" value="B"/>
                            <Picker.Item label="B-" value="B-"/>
                            <Picker.Item label="AB" value="AB"/>
                            <Picker.Item label="AB-" value="AB-"/>
                            <Picker.Item label="O" value="O"/>
                            <Picker.Item label="O-" value="O-"/>
                        </Picker>
                        <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5", marginTop:8 }}>Phone No.</Text>
                        <Input keyboardType="name-phone-pad" placeholder='Enter your phone number' onChangeText={(v)=>{ this.setState({phone:v}) }} value={this.state.phone} leftIcon={<Icon type='material-community' name="phone-classic" size={20} color='#4267b2'/>} />
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
                        <Input placeholder='Enter your academic qualification' onChangeText={(v)=>{ this.setState({academic:v}) }} value={this.state.academic} leftIcon={<Icon type='ionicon' name="school" size={20} color='#4267b2'/>} />

                        <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5" }}>Charge Per Appointment</Text>
                        <Input placeholder='Enter charge per appointment' onChangeText={(v)=>{ this.setState({charge:v}) }} value={this.state.charge} leftIcon={<Icon type='material-community' name="cash" size={20} color='#4267b2'/>} />
                        {
                            (!this.state.isEdit)?
                                <Button title="Submit" onPress={() => this.register()} />
                            :
                                <Button title="Update" onPress={() => this.update()} />
                        }
                    </View>
                </ScrollView>
            </View>
        );
    }
}