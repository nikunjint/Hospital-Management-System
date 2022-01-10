import React from 'react';
import { View, StatusBar, ScrollView, RefreshControl, Alert } from 'react-native';
import { Text, Image, Button} from 'react-native-elements';
import Utils from '../modules/Utils';
import Toast from 'react-native-simple-toast';

export default class UserProfileInformationScreen extends React.Component{
    state = {
        spinnerTitle: "loading..",
        spinner: false,

        name:"",
        email: "",
        sex: "",
        blood: "A+",
        phone: "",
        address: "",
        photo: "",

        isEdit:false,
    }

    componentDidMount(){
        this.loadPatientInfo();
    }

    loadPatientInfo = async() => {
        try{
            this.setState({spinner:true, spinnerTitle:"loading patient info..", refreshing:true});
            const url = Utils.serverUrl() + "user-info?_id=" + this.props.route.params.id;
            const response = await fetch(url);
            const json = await response.json();
            if(json.status == 200){
                const data = json.content;
                this.setState({ isEdit:true, id: data._id, address: data.address, blood: data.blood, email: data.email, name: data.fullname, sex: data.gender, phone: data.phone, photo: data.photo});
            }
            else Alert.alert("Error", json.content);
            this.setState({spinner:false, refreshing:false});
        }
        catch(error){
            console.error(error);
        }
    }

    remove = async() => {
        const removeUser = async() => {
            try{
                this.setState({spinner:true, spinnerTitle:"removing patient info..", refreshing:true});
                const url = Utils.serverUrl() + "remove-patient?_id=" + this.props.route.params.id;
                const response = await fetch(url);
                const json = await response.json();
                if(json.status == 200){
                    const data = json.content;
                    Toast.show(data, Toast.SHORT);
                    this.props.navigation.pop();
                }
                else Alert.alert("Error", json.content);
                this.setState({spinner:false, refreshing:false});
            }
            catch(error){
                console.error(error);
            }
        }

        Alert.alert("Warning!", "Are you sure want to remove?", [ { text: "Cancel", style: "cancel" }, { text: "Yes", onPress: () => removeUser() } ] );
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
                    <ScrollView refreshControl={ <RefreshControl refreshing={this.state.refreshing} onRefresh={this.loadPatientInfo}/> } style={{ flex: 1, backgroundColor:"#fff" }}>
                        <View style={{ margin:10, padding:10, alignSelf:"stretch", marginBottom:20 }}>
                            <View style={{ flex:1, alignContent:"center", justifyContent:"center", flexDirection:"row", marginBottom:30 }}>
                                { this.state.photo!=""? <Image source={{ uri:this.state.photo }} style={{ width:200, height:200 }}/> : <Image source={ require("../assets/icons/image-not-found.png") } style={{ width:200, height:200 }}/> }
                            </View>
                            <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5" }}>Full Name</Text>
                            <Text style={{ marginLeft:10, marginBottom:10, fontSize:17, color:"#6e6e6e" }}>{this.state.name}</Text>
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
                            {
                                (this.state.isEdit)?
                                    <View style={{ marginTop:30 }}>
                                        <Button title="Remove" onPress={() => this.remove()} />
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