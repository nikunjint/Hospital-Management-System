import React from 'react';
import { View, StatusBar, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text, Button, Divider} from 'react-native-elements';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Utils  from '../modules/Utils';

export default class AppointmentMakerScreen extends React.Component{
    state = {
        spinnerTitle: "loading..",
        spinner: false,

        id:"",

        startDate: new Date(Date.now()),
        startDateVisible: false,

        endDate: new Date(Date.now()),
        endDateVisible: false,

        isEdit:false
    }

    componentDidMount(){
        if(this.props.route.params){
            const id = this.props.route.params.id;
            const startDate = new Date(parseFloat(this.props.route.params.startDate));
            const endDate = new Date(parseFloat(this.props.route.params.endDate));
            this.setState({id:id, startDate: startDate, endDate: endDate, isEdit:true});
        }
    }

    save = async() => {
        try{
            this.setState({ spinner:true, spinnerTitle: "saving appointment.."});
            const url = Utils.serverUrl() + "doctor-create-appointment?doctorId="+global.id+"&startDate="+ this.state.startDate.getTime() +"&endDate=" + this.state.endDate.getTime();
            const response = await fetch(url);
            const json = await response.json();
            if(json.status == 200){
                Alert.alert("Info", json.content);
                this.props.navigation.pop();
            }
            else Alert.alert("Error", json.content);
            this.setState({spinner:false});
        }
        catch(error){
            this.setState({spinner:false});
            console.error(error);
        }
    }

    update = async() => {
        try{
            this.setState({ spinner:true, spinnerTitle: "updating appointment.."});
            const url = Utils.serverUrl() + "doctor-update-appointment?_id="+ this.state.id +"&doctorId="+global.id+"&startDate="+ this.state.startDate.getTime() +"&endDate=" + this.state.endDate.getTime();
            const response = await fetch(url);
            const json = await response.json();
            if(json.status == 200) Alert.alert("Info", json.content);
            else Alert.alert("Error", json.content);
            this.setState({spinner:false});
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
                <DateTimePickerModal testID="startDate" mode="datetime" isVisible={this.state.startDateVisible} onConfirm={date => this.setState({startDate:date, startDateVisible:false})} onCancel={()=>{ this.setState({startDateVisible:false}) }}/>
                <DateTimePickerModal testID="endDate" mode="datetime" isVisible={this.state.endDateVisible} onConfirm={date => this.setState({endDate:date, endDateVisible:false})}  onCancel={()=>{ this.setState({startDateVisible:false}) }}/>
                {
                    this.state.spinner?
                        <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
                            <Text>{this.state.spinnerTitle}</Text>
                        </View>
                    :
                        <ScrollView style={{ flex: 1, backgroundColor:"#fff" }}>
                            <View style={{ margin:10, padding:10, alignSelf:"stretch", marginBottom:20 }}>
                                <TouchableOpacity activeOpacity={0.7} onPress={()=> this.setState({startDateVisible:true})}>
                                    <View>
                                        <Text style={{ marginLeft:10, fontSize:16, color:"#3578e5" }}>Start Date Time</Text>
                                        <Text style={{ marginLeft:10, fontSize:20, color:"#3578e5" }}>{this.state.startDate.toLocaleString("en-US")}</Text>
                                    </View>
                                </TouchableOpacity>
                                <Divider style={{ height:20, backgroundColor:"#fff" }} />
                                <TouchableOpacity activeOpacity={0.7} onPress={() => this.setState({endDateVisible:true})}>
                                    <View>
                                        <Text style={{ marginLeft:10, fontSize:16, color:"#3578e5" }}>End Date Time</Text>
                                        <Text style={{ marginLeft:10, fontSize:20, color:"#3578e5" }}>{this.state.endDate.toLocaleString("en-US")}</Text>
                                    </View>
                                </TouchableOpacity>
                                <Divider style={{ height:20, backgroundColor:"#fff" }} />
                                {
                                    this.state.isEdit?
                                        <Button title="Update" onPress={() => this.update()} />
                                    :
                                        <Button title="Save" onPress={() => this.save()} />
                                }
                                
                            </View>
                        </ScrollView>
                }
            </View>
        );
    }
}