import React from 'react';
import { View, StatusBar, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text, Button, Divider, Input } from 'react-native-elements';
import Utils  from '../modules/Utils';
import Toast from 'react-native-simple-toast';

export default class BedMakerScreen extends React.Component{
    state = {
        spinnerTitle: "loading..",
        spinner: false,

        id:"",
        bedRoomTitle: "",
        totalBed: "0",
        rate: "0",

        isEdit:false
    }

    componentDidMount(){
        if(this.props.route.params){
            this.setState({ 
                id: this.props.route.params.id, 
                bedRoomTitle: this.props.route.params.title, 
                totalBed: this.props.route.params.total + "",
                rate: this.props.route.params.rate + "",
                isEdit: true 
            }); 
        }
    }

    save = async() => {
        try{
            if(this.state.bedRoomTitle == "" || this.state.totalBed == "" || this.state.rate == ""){ Toast.show("Fill form correctly!"); return; }
            this.setState({ refreshing:true, spinner:true, spinnerTitle: "saving bed info.."});
            const url = Utils.serverUrl() + "bed-management-create?title="+ this.state.bedRoomTitle +"&total=" + this.state.totalBed +"&rate=" + this.state.rate;
            const response = await fetch(url);
            const json = await response.json();
            if(json.status == 200){ this.setState({bedRoomTitle:"", totalBed: "", rate:"0"}); Alert.alert("Info", json.content); }
            else Alert.alert("Error", json.content);
            this.setState({spinner:false, refreshing:false});
        }
        catch(error){
            this.setState({spinner:false});
            console.error(error);
        }
    }

    update = async() => {
        try{
            if(this.state.bedRoomTitle == "" || this.state.totalBed == ""){ Toast.show("Fill form correctly!"); return; }
            this.setState({refreshing:true, spinner:true, spinnerTitle: "updating bed info.."});
            const url = Utils.serverUrl() + "bed-management-update?title="+ this.state.bedRoomTitle + "&total=" + this.state.totalBed +"&rate=" + this.state.rate + "&id=" + this.state.id;
            const response = await fetch(url);
            const json = await response.json();
            if(json.status == 200){ Alert.alert("Info", json.content); }
            else Alert.alert("Error", json.content);
            this.setState({spinner:false, refreshing:false});
        }
        catch(error){
            this.setState({spinner:false});
            console.error(error);
        }

    }

    remove = () => {
        const removeInfo = async() => {
            try{
                if(this.state.id == "" ||this.state.bedRoomTitle == "" || this.state.totalBed == ""){ Toast.show("Fill form correctly!"); return; }
                this.setState({ refreshing:true, spinner:true, spinnerTitle: "removing bed info.."});
                const url = Utils.serverUrl() + "bed-management-remove?id=" + this.state.id;
                const response = await fetch(url);
                const json = await response.json();
                if(json.status == 200){ Alert.alert("Info", json.content); this.props.navigation.pop(); }
                else Alert.alert("Error", json.content);
                this.setState({spinner:false, refreshing:false});
            }
            catch(error){
                this.setState({spinner:false});
                console.error(error);
            }
        }
        Alert.alert("Warning!", "Are you sure want to remove?", [ { text: "Cancel", style: "cancel" }, { text: "Yes", onPress: () => removeInfo() } ] );
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
                            <View style={{ margin:10, padding:10, alignSelf:"stretch", marginBottom:20 }}>
                                <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5", marginTop:8 }}>Bed Room Title</Text>
                                <Input placeholder='Enter bed room title' onChangeText={(v)=>{ this.setState({bedRoomTitle:v}) }} value={this.state.bedRoomTitle}/>
                                <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5" }}>Total Bed</Text>
                                <Input keyboardType="numeric" placeholder='Enter total number of bed' onChangeText={(v)=>{ this.setState({totalBed:v}) }} value={this.state.totalBed} />
                                <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5" }}>Charge [Rs.] (per bed)</Text>
                                <Input keyboardType="numeric" placeholder='Enter rate for per bed' onChangeText={(v)=>{ this.setState({rate:v}) }} value={this.state.rate} />
                                <Divider style={{ height:20, backgroundColor:"#fff" }} />
                                {
                                    !this.state.isEdit?
                                        <Button icon={{ type:"feather", name:"save", size:20, color:"white" }} containerStyle={{ padding: 5 }} title="Save" onPress={()=> this.save()}/>
                                    :
                                        <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                                            <Button icon={{ type:"feather", name:"save", size:20, color:"white" }} containerStyle={{ width: '50%', padding: 5 }} title="Update" onPress={()=> this.update()}/>
                                            <Button icon={{ type:"antdesign", name:"delete", size:20, color:"white" }} containerStyle={{ width: '50%', padding: 5 }} buttonStyle={{backgroundColor: 'red'}} title="Remove" onPress={()=> this.remove()}/>
                                        </View>
                                }
                            </View>
                        </ScrollView>
                }
            </View>
        );
    }
}