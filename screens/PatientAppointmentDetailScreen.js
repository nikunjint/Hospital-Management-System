import React from 'react';
import { View, StatusBar, ScrollView } from 'react-native';
import { Text, Button, Image, Card} from 'react-native-elements';
import Toast from 'react-native-simple-toast';
import Utils  from '../modules/Utils';

export default class PatientAppointmentDetailScreen extends React.Component{
    state = {
        spinnerTitle: "loading..",
        spinner: false,
        
        fullname: "",
        gender: "",
        email: "",
        phone: "",
        blood: "",
        photo: "",
        address: "",
        dob: "2021-01-02",

        pid: "",
        appointment_id: "",
        reserved_id: "",
        reserved_created: "",
        reserved_paymentMethod: "",
        remarks: "",
        
        startDate: "",
        endDate: "",
        startDate_str: "",
        endDate_str: "",
    }

    componentDidMount(){
        if(this.props.route.params.pid){ this.setState({ pid: this.props.route.params.pid }); }
        if(this.props.route.params.fullname){ this.setState({ fullname: this.props.route.params.fullname }); }
        if(this.props.route.params.gender){ this.setState({ gender: this.props.route.params.gender }); }
        if(this.props.route.params.result.patientDetail.email){ this.setState({ email: this.props.route.params.result.patientDetail.email }); }
        if(this.props.route.params.result.patientDetail.phone){ this.setState({ phone: this.props.route.params.result.patientDetail.phone }); }
        if(this.props.route.params.result.patientDetail.blood){ this.setState({ blood: this.props.route.params.result.patientDetail.blood }); }
        if(this.props.route.params.result.patientDetail.photo){ this.setState({ photo: this.props.route.params.result.patientDetail.photo }); }
        if(this.props.route.params.result.patientDetail.address){ this.setState({ address: this.props.route.params.result.patientDetail.address }); }

        if(this.props.route.params.result.reservedAppointment.appointmentId){ this.setState({ appointment_id: this.props.route.params.result.reservedAppointment.appointmentId }); }
        if(this.props.route.params.result.reservedAppointment._id){ this.setState({ reserved_id: this.props.route.params.result.reservedAppointment._id }); }
        if(this.props.route.params.result.reservedAppointment.reservedAt){ this.setState({ reserved_created: this.props.route.params.result.reservedAppointment.reservedAt }); }
        if(this.props.route.params.result.reservedAppointment.paymentMethod){ this.setState({ reserved_paymentMethod: this.props.route.params.result.reservedAppointment.paymentMethod }); }
        if(this.props.route.params.result.reservedAppointment.remarks){ this.setState({ remarks: this.props.route.params.result.reservedAppointment.remarks }); }
        
        
        if(this.props.route.params.startDate){ this.setState({ startDate: this.props.route.params.startDate }); }
        if(this.props.route.params.startDate_str){ this.setState({ startDate_str: this.props.route.params.startDate_str }); }
        if(this.props.route.params.endDate){ this.setState({ endDate: this.props.route.params.endDate }); }
        if(this.props.route.params.endDate_str){ this.setState({ endDate_str: this.props.route.params.endDate_str }); }
    }

    finishExamine = async() =>{
        try{
            this.setState({ spinner:true, spinnerTitle: "updating appointment.."});
            const url = Utils.serverUrl() + "patient-examine-finished?_id="+ this.state.reserved_id;
            const response = await fetch(url);
            const json = await response.json();
            if(json.status == 200) {
                Toast.show(json.content, Toast.SHORT);
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

    render(){
        const age = Utils.getAge(this.state.dob);
        return(
            <View style={{ flex:1 }}>
                <StatusBar barStyle="dark-content" backgroundColor="#fff" />
                {
                    this.state.spinner?
                        <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
                            <Text>{this.state.spinnerTitle}</Text>
                        </View>
                    :
                        <ScrollView style={{ flex: 1, backgroundColor:"#fff" }}>
                            <View style={{ alignSelf:"stretch", marginBottom:20 }}>
                                <View style={{ flex:1, alignContent:"center", justifyContent:"center", flexDirection:"row", marginBottom:30, marginTop:30 }}>
                                    { this.state.photo==""? <Image source={require("../assets/icons/image-not-found.png")} style={{ width:200, height:200 }}/> : <Image source={{ uri: this.state.photo }} style={{ width:200, height:200 }}/> }
                                </View>
                                <Card>
                                    <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5" }}>Name</Text>
                                    <Text style={{ marginLeft:10, marginBottom:10, fontSize:20, color:"#3578e5", fontWeight:"bold" }}>{this.state.fullname}</Text>
                                    <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5" }}>Bilogical Gender</Text>
                                    <Text style={{ marginLeft:10, marginBottom:10, fontSize:20, color:"#3578e5", fontWeight:"bold" }}>{this.state.gender}</Text>
                                    <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5" }}>Phone</Text>
                                    <Text style={{ marginLeft:10, marginBottom:10, fontSize:20, color:"#3578e5", fontWeight:"bold" }}>{this.state.phone}</Text>
                                    <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5" }}>Email</Text>
                                    <Text style={{ marginLeft:10, marginBottom:10, fontSize:20, color:"#3578e5", fontWeight:"bold" }}>{this.state.email}</Text>
                                    <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5" }}>Address</Text>
                                    <Text style={{ marginLeft:10, marginBottom:10, fontSize:20, color:"#3578e5", fontWeight:"bold" }}>{this.state.address}</Text>
                                </Card>
                                <Card>
                                    <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5" }}>Start Date</Text>
                                    <Text style={{ marginLeft:10, marginBottom:10, fontSize:20, color:"#3578e5", fontWeight:"bold" }}>{this.state.startDate_str}</Text>
                                    <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5" }}>End Date</Text>
                                    <Text style={{ marginLeft:10, marginBottom:10, fontSize:20, color:"#3578e5", fontWeight:"bold" }}>{this.state.endDate_str}</Text>
                                </Card>
                                <Card>
                                    {
                                        this.state.remarks.trim() != ""?
                                            <View>
                                                <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5" }}>Remarks</Text>
                                                <Text style={{ marginLeft:10, marginBottom:10, fontSize:16, color:"#3578e5", textAlign:"justify" }}>{this.state.remarks}</Text>
                                            </View>
                                        :
                                            null
                                    }
                                    
                                    <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5" }}>Payment Method</Text>
                                    <Text style={{ marginLeft:10, marginBottom:10, fontSize:20, color:"#3578e5", fontWeight:"bold" }}>{this.state.reserved_paymentMethod}</Text>
                                </Card>

                                <Button containerStyle={{ margin:15 }} title="Add Report" onPress={()=> this.props.navigation.navigate("PatientReportScreen_Add", { aid: this.state.appointment_id, mode:"ADD", pid: this.state.pid})} />
                                <Button containerStyle={{ margin:15 }} title="Mark As Examine Finished" onPress={()=> this.finishExamine()} />
                            </View>
                        </ScrollView>
                }
                
            </View>
        );
    }
}