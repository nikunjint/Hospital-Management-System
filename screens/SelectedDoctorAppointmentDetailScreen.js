import React from 'react';
import { View, StatusBar, ScrollView, Alert } from 'react-native';
import { Text, Divider, Button, Card, Input} from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-simple-toast';
import Utils  from '../modules/Utils';

export default class SelectedDoctorAppointmentDetailScreen extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            spinner:false,
            spinnerTitle: "loading..",
            refreshing:false,

            appointmentId: props.route.params.appointment.id,
            startDate:  props.route.params.appointment.startDate,
            endDate:  props.route.params.appointment.endDate,
            startDate_str:  props.route.params.appointment.startDate_str,
            endDate_str:  props.route.params.appointment.endDate_str,

            doc_id: props.route.params.doctor.id,
            doc_prefix: props.route.params.doctor.prefix,
            doc_name:  props.route.params.doctor.fullname,
            doc_email:  props.route.params.doctor.email,
            doc_phone:  props.route.params.doctor.phone,
            doc_charge: props.route.params.doctor.charge,

            remarks: "",
            paymentMethod: "",

            isReadOnly:false,
            isExpired: false,
        }
    }

    componentDidMount(){
        if(this.props.route.params.appointment.remarks){ this.setState({ remarks: this.props.route.params.appointment.remarks, isReadOnly:true }); }
        if(this.props.route.params.appointment.paymentMethod){ this.setState({ paymentMethod: this.props.route.params.appointment.paymentMethod }); }
        if(this.props.route.params.appointment.isExpired){ this.setState({ isExpired: this.props.route.params.appointment.isExpired }); }
        if(this.props.route.params.isReadOnly){ this.setState({ isReadOnly: this.props.route.params.isReadOnly }); }
    }

    bookAppointment = async() => {
        if(this.state.paymentMethod != ""){
            if(this.state.paymentMethod == "KHALTI"){
                const data = {
                    product_identity: this.state.doc_id,
                    product_name: this.state.doc_prefix + " " + this.state.doc_name,
                    amount: this.state.doc_charge,

                    doctorId: this.state.doc_id,
                    appointmentId: this.state.appointmentId,
			        remarks: this.state.remarks,
                    paymentMethod: this.state.paymentMethod,
                };
                this.props.navigation.navigate("KhaltiPaymentInitiate", data);
            }
           else Toast.showWithGravity("Payment method not selected.", Toast.SHORT, Toast.CENTER);
        }
        else Toast.showWithGravity("Payment method not selected.", Toast.SHORT, Toast.CENTER);
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
                        <ScrollView style={{ flex: 1, backgroundColor:"#fff" }}>
                            { this.state.isExpired?<Text style={{ marginTop:20, alignSelf:"center", fontSize:18, fontWeight:"bold", color:"red" }}>Expired</Text>:null }
                            <Card style={{ margin:10, padding:10, alignSelf:"stretch", marginBottom:20, backgroundColor: "#f7f7f7" }}>
                                <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5" }}>Appointment Date Time</Text>
                                <Text style={{ marginLeft:10, fontSize:20, color:"#6c6c6c", fontWeight:"bold" }}>{this.state.startDate_str}</Text>
                                <Text style={{ marginLeft:10, marginBottom:10, fontSize:20, color:"#6c6c6c", fontWeight:"bold" }}>{this.state.endDate_str}</Text>
                            </Card>
                            <Card style={{ margin:10, padding:10, alignSelf:"stretch" }}>
                                <Text style={{ fontSize:18, color:"#3578e5", fontWeight:"bold", marginBottom:4 }}>Doctor Information</Text>
                                <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5" }}>Full Name</Text>
                                <Text style={{ marginLeft:10, marginBottom:10, fontSize:20, color:"#6c6c6c", fontWeight:"bold" }}>{ this.state.doc_prefix + " " + this.state.doc_name}</Text>
                                <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5" }}>Email</Text>
                                <Text style={{ marginLeft:10, marginBottom:10, fontSize:20, color:"#6c6c6c", fontWeight:"bold" }}>{this.state.doc_email}</Text>
                                <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5" }}>Phone No.</Text>
                                <Text style={{ marginLeft:10, marginBottom:10, fontSize:20, color:"#6c6c6c", fontWeight:"bold" }}>{this.state.doc_phone}</Text>
                            </Card>
                            <Card style={{ margin:10, padding:10, alignSelf:"stretch" }}>
                                <Text style={{ fontSize:18, color:"#3578e5", fontWeight:"bold", marginBottom:4 }}>Charge</Text>
                                <Text style={{ marginLeft:10, marginBottom:10, fontSize:20, color:"#6c6c6c", fontWeight:"bold" }}>Rs.{this.state.doc_charge}/-</Text>
                            </Card>
                            <View style={{ margin:10, padding:10, alignSelf:"stretch", marginBottom:20 }}>
                                <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5" }}>Remarks</Text>
                                {
                                    this.state.isReadOnly?
                                        this.state.remarks.trim() != ""?
                                            <Text style={{ marginLeft:10, marginBottom:10, color:"#6c6c6c" }}>{ this.state.remarks}</Text>
                                        :
                                            <Text style={{ marginLeft:10, marginBottom:10, color:"#6c6c6c" }}>----</Text>
                                    :
                                        <Input onChangeText={remarks => this.setState({remarks:remarks})}/>
                                }
                                
                                <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5" }}>Payment Method</Text>
                                {
                                    this.state.isReadOnly?
                                        <Text style={{ marginLeft:10, marginBottom:10, fontSize:20, color:"#6c6c6c", fontWeight:"bold" }}>{ this.state.paymentMethod}</Text>
                                    :
                                        <Picker style={{padding:5, margin:5}} selectedValue={this.state.paymentMethod} style={{height:50}} onValueChange={(v,i)=>{ this.setState({paymentMethod:v}); }}>
                                            <Picker.Item label="Select Payment Method" value=""/>
                                            <Picker.Item label="Khalti" value="KHALTI"/>
                                        </Picker>
                                }
                                
                                <Divider style={{ height:20, backgroundColor:"#fff"}} />
                                { 
                                    !this.state.isReadOnly? 
                                        <Button title="Book An Appointment" buttonStyle={{ padding:20 }} onPress={() => this.bookAppointment() } icon={{ name:"bookmark", type:"font-awesome-5", size:24, color:"#fff"  }} /> 
                                    :
                                        null 
                                }
                                {
                                    global.userType=="PATIENT" && this.state.isReadOnly?
                                        <Button title="My Report" onPress={() => this.props.navigation.navigate("PatientReportScreen", { aid: this.state.appointmentId, mode: "VIEW" }) } />
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