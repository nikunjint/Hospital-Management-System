import React from 'react';
import { View, StatusBar, ScrollView, Alert, AppState, RefreshControl } from 'react-native';
import { Text, Image, Button} from 'react-native-elements';
import Utils  from '../modules/Utils';
import Toast from 'react-native-simple-toast';

export default class DoctorProfileInformationScreen extends React.Component{
    state = {
        spinnerTitle: "loading..",
        spinner: false,
        appState: AppState.currentState,

        refreshing: false,

        id:"",
        prefix: "",
        name: "",
        email: "",
        sex: "",
        blood: "A+",
        phone: "",
        address: "",
        department: "",
        photo: "123",
        academic: "",
        charge: "",
    }

    componentDidMount() {
        this.loadDoctorInfo();
    }

    loadDoctorInfo = async() => {
        try{
            this.setState({spinner:true, spinnerTitle:"loading doctor info..", refreshing:true});
            const url = Utils.serverUrl() + "doctor-info?_id=" + this.props.route.params.id;
            const response = await fetch(url);
            const json = await response.json();
            if(json.status == 200){
                const data = json.content;
                this.setState({ id: data._id, academic: data.academic, address: data.address, blood: data.blood, department: data.department, email: data.email, name: data.fullname, sex: data.gender, phone: data.phone, photo: data.photo, prefix: data.prefix, charge:data.charge});
            }
            else Alert.alert("Error", json.content);
            this.setState({spinner:false, refreshing:false});
        }
        catch(error){
            console.error(error);
        }
    }

    editInfo = () => {
        const data = { 
            id: this.state.id, 
            prefix: this.state.prefix, 
            name: this.state.name, 
            email: this.state.email, 
            sex: this.state.sex, 
            blood: this.state.blood, 
            phone: this.state.phone, 
            address: this.state.address, 
            department: this.state.department, 
            photo: this.state.photo, 
            academic: this.state.academic, 
            charge: this.state.charge
        };
        this.props.navigation.navigate("Edit_RegisterDoctorScreen", data) ;
    }

    removeInfo = () => {
        const removeDoctor = async() => {
            try{
                this.setState({spinner:true, spinnerTitle:"removing doctor info.."});
                const url = Utils.serverUrl() + "remove-doctor?_id=" + this.props.route.params.id;
                const response = await fetch(url);
                const json = await response.json();
                if(json.status == 200){
                    Toast.show(json.content, Toast.SHORT);
                    this.props.navigation.pop();
                }
                else Alert.alert("Error", json.content);
                this.setState({spinner:false});
            }
            catch(error){
                console.error(error);
            }
        }

        Alert.alert("Warning!", "Are you sure want to remove?", [ { text: "Cancel", style: "cancel" }, { text: "Yes", onPress: () => removeDoctor() } ] );
    }

    render(){
        return(
            <View style={{ flex:1 }}>
                <StatusBar barStyle="dark-content" backgroundColor="#fff" />
                {
                    this.state.spinner?
                        <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
                            <Text>{this.state.spinnerTitle}</Text>
                        </View>
                    :
                        <ScrollView refreshControl={ <RefreshControl refreshing={this.state.refreshing} onRefresh={this.loadDoctorInfo}/> } style={{ flex: 1, backgroundColor:"#fff" }}>
                            <View style={{ margin:10, padding:10, alignSelf:"stretch", marginBottom:20 }}>
                                <View style={{ flex:1, alignContent:"center", justifyContent:"center", flexDirection:"row", marginBottom:30 }}>
                                    <Image source={{ uri: this.state.photo}} style={{ width:200, height:200 }}/>
                                </View>
                                <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5" }}>Full Name</Text>
                                <Text style={{ marginLeft:10, marginBottom:10, fontSize:17, color:"#6e6e6e" }}>{ this.state.prefix + " "+ this.state.name}</Text>
                                <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5" }}>Email</Text>
                                <Text style={{ marginLeft:10, marginBottom:10, fontSize:17, color:"#6e6e6e" }}>{this.state.email}</Text>
                                <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5" }}>Biological Gender</Text>
                                <Text style={{ marginLeft:10, marginBottom:10, fontSize:17, color:"#6e6e6e" }}>{this.state.sex}</Text>
                                <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5", marginTop:8 }}>Blood Group</Text>
                                <Text style={{ marginLeft:10, marginBottom:10, fontSize:17, color:"#6e6e6e" }}>{this.state.blood}</Text>
                                <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5", marginTop:8 }}>Phone No.</Text>
                                <Text style={{ marginLeft:10, marginBottom:10, fontSize:17, color:"#6e6e6e" }}>{this.state.phone}</Text>
                                <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5" }}>Address</Text>
                                <Text style={{ marginLeft:10, marginBottom:10, fontSize:17, color:"#6e6e6e" }}>{this.state.address}</Text>
                                <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5" }}>Department</Text>
                                <Text style={{ marginLeft:10, marginBottom:10, fontSize:17, color:"#6e6e6e" }}>{this.state.department}</Text>
                                <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5" }}>Academic</Text>
                                <Text style={{ marginLeft:10, marginBottom:10, fontSize:17, color:"#6e6e6e" }}>{this.state.academic}</Text>
                                <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5" }}>Charge</Text>
                                <Text style={{ marginLeft:10, marginBottom:10, fontSize:17, color:"#6e6e6e" }}>Rs.{this.state.charge}/-</Text>
                                {
                                    (global.userType == "ADMIN")?
                                        <View style={{ flexDirection:"row", flex:1, justifyContent:"space-around", marginTop:20 }}>
                                            <Button icon={{ name:"edit", type:"antdesign", size:18, color:"white" }} title="Edit Info" onPress={() => this.editInfo()}/>
                                            <Button icon={{ name:"delete", type:"antdesign", size:18, color:"white" }} title="Remove Info" onPress={() => this.removeInfo()}/>
                                        </View>
                                    :
                                        null
                                }
                            </View>
                        </ScrollView>
                }
            </View>
        );
    }
}