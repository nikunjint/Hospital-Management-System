import React from 'react';
import { View, StatusBar, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Divider, Text, Avatar, Card } from 'react-native-elements';
import { STORAGE_EMAIL, STORAGE_PASS } from '../modules/Environment';
import Utils  from '../modules/Utils';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class DashboardScreen extends React.Component{
    state = {
        appSlogan: "Empowering People to Improve Their Lives.",
        id: "",
        fullname: "",
        userType: "", //ADMIN, DOCTOR, PATIENT

        spinnerTitle:"loading..",
        spinner: false
    }

    componentDidMount() {
        if(this.props.route.params){
            global.id = this.props.route.params.id;
            global.fullname = this.props.route.params.fullname;
            global.userType = this.props.route.params.userType;
            this.setState({ id: global.id, fullname: global.fullname, userType: global.userType });
        }
    }

    dashboard = () => {
        if(this.state.userType == "ADMIN") return this.adminDashboard();
        else if(this.state.userType == "DOCTOR") return this.doctorDashboard();
        else if(this.state.userType == "PATIENT") return this.patientDashboard();
        else return null;
    }

    adminDashboard = () => {
        return(
            <View style={{ flex: 1, flexDirection:"column" }}>
                <View style={{flex:1, flexDirection:"row", paddingBottom:20}}>
                    <TouchableOpacity style={{ flex:1}} onPress={()=>{ this.routeScreen("RegisterDoctorScreen") }} activeOpacity={0.8}>
                        <Card containerStyle={{ borderRadius:20 }}>
                            <View style={{ alignItems:"center" }}>
                                <Image source={require("../assets/icons/register-doctor.png")} style={{ width:100, height:100 }}/>
                                <Text style={{marginBottom: 10, marginTop:10, color:"#969696", textAlign:"center"}}>Register Doctor</Text>
                            </View>
                        </Card>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex:1}} onPress={()=>{ this.routeScreen("DoctorListScreen") }} activeOpacity={0.8}>
                        <Card containerStyle={{ borderRadius:20 }}>
                            <View style={{ alignItems:"center" }}>
                                <Image source={require("../assets/icons/doctor-list.png")} style={{ width:100, height:100 }}/>
                                <Text style={{marginBottom: 10, marginTop:10, color:"#969696", textAlign:"center"}}>Doctors List</Text>
                            </View>
                        </Card>
                    </TouchableOpacity>
                </View>
                <View style={{flex:1, flexDirection:"row", paddingBottom:20}}>
                    <TouchableOpacity style={{ flex:1}} onPress={()=>{ this.routeScreen("BedManagementListScreen") }} activeOpacity={0.8}>
                        <Card containerStyle={{ borderRadius:20 }}>
                            <View style={{ alignItems:"center" }}>
                            <Image source={require("../assets/icons/bed-management.png")} style={{ width:100, height:100}}/>
                                <Text style={{marginBottom: 10, marginTop:10, color:"#969696", textAlign:"center"}}>Bed Management</Text>
                            </View>
                        </Card>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex:1}} onPress={()=>{ this.routeScreen("BookedBedsScreen") }} activeOpacity={0.8}>
                        <Card containerStyle={{ borderRadius:20 }}>
                            <View style={{ alignItems:"center" }}>
                                <Image source={require("../assets/icons/reserved-bed.png")} style={{ width:100, height:100}}/>
                                <Text style={{marginBottom: 10, marginTop:10, color:"#969696", textAlign:"center"}}>Booked Beds</Text>
                            </View>
                        </Card>
                    </TouchableOpacity>
                </View>
                <View style={{flex:1, flexDirection:"row", paddingBottom:20}}>
                    <TouchableOpacity style={{ flex:1}} onPress={()=>{ this.routeScreen("AdminBloodBankListScreen") }} activeOpacity={0.8}>
                        <Card containerStyle={{ borderRadius:20 }}>
                            <View style={{ alignItems:"center" }}>
                            <Image source={require("../assets/icons/blood-bank.png")} style={{ width:100, height:100}}/>
                                <Text style={{marginBottom: 10, marginTop:10, color:"#969696", textAlign:"center"}}>Blood Banks List</Text>
                            </View>
                        </Card>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex:1}} onPress={()=>{ this.routeScreen("AdminBloodDonationFormListScreen") }} activeOpacity={0.8}>
                        <Card containerStyle={{ borderRadius:20 }}>
                            <View style={{ alignItems:"center" }}>
                                <Image source={require("../assets/icons/donate-blood.png")} style={{ width:100, height:100}}/>
                                <Text style={{marginBottom: 10, marginTop:10, color:"#969696", textAlign:"center"}}>Blood Donation Form List</Text>
                            </View>
                        </Card>
                    </TouchableOpacity>
                </View>
                <View style={{flex:1, flexDirection:"row", paddingBottom:20}}>
                    <TouchableOpacity style={{ flex:1}} onPress={()=>{ this.routeScreen("AdminAmbulanceServiceListScreen") }} activeOpacity={0.8}>
                        <Card containerStyle={{ borderRadius:20 }}>
                            <View style={{ alignItems:"center" }}>
                                <Image source={require("../assets/icons/ambulance.png")} style={{ width:100, height:100 }}/>
                                <Text style={{marginBottom: 10, marginTop:10, color:"#969696", textAlign:"center"}}>Ambulance Services</Text>
                            </View>
                        </Card>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex:1}} onPress={()=>{ this.routeScreen("UsersListScreen") }} activeOpacity={0.8}>
                        <Card containerStyle={{ borderRadius:20 }}>
                            <View style={{ alignItems:"center" }}>
                                <Image source={require("../assets/icons/user-list.png")} style={{ width:100, height:100 }}/>
                                <Text style={{marginBottom: 10, marginTop:10, color:"#969696", textAlign:"center"}}>Users List</Text>
                            </View>
                        </Card>
                    </TouchableOpacity>
                </View>
                <View style={{flex:1, flexDirection:"row", paddingBottom:20}}>
                    <TouchableOpacity style={{ flex:1}} onPress={()=>{ this.routeScreen("MyProfileInformationScreen") }} activeOpacity={0.8}>
                        <Card containerStyle={{ borderRadius:20 }}>
                            <View style={{ alignItems:"center" }}>
                            <Image source={require("../assets/icons/my-profile.png")} style={{ width:100, height:100}}/>
                                <Text style={{marginBottom: 10, marginTop:10, color:"#969696", textAlign:"center"}}>My Profile</Text>
                            </View>
                        </Card>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex:1}} onPress={()=>{ this.logout() }} activeOpacity={0.8}>
                        <Card containerStyle={{ borderRadius:20 }}>
                            <View style={{ alignItems:"center" }}>
                                <Image source={require("../assets/icons/logout.png")} style={{ width:100, height:100 }}/>
                                <Text style={{marginBottom: 10, marginTop:10, color:"#969696", textAlign:"center"}}>Logout</Text>
                            </View>
                        </Card>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    doctorDashboard = () =>{
        return(
            <View style={{ flex: 1, flexDirection:"column" }}>
                <View style={{flex:1, flexDirection:"row", paddingBottom:20}}>
                    <TouchableOpacity style={{ flex:1}} onPress={()=>{this.routeScreen("ManagementAppointmentScreen")}} activeOpacity={0.8}>
                        <Card containerStyle={{ borderRadius:20 }}>
                            <View style={{ alignItems:"center" }}>
                                <Image source={require("../assets/icons/manage-appointment.png")} style={{ width:100, height:100 }}/>
                                <Text style={{marginBottom: 10, marginTop:10, color:"#969696", textAlign:"center"}}>Manage Appointment</Text>
                            </View>
                        </Card>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex:1}} onPress={()=>{ this.routeScreen("PatientsAppointmentListScreen") }} activeOpacity={0.8}>
                        <Card containerStyle={{ borderRadius:20 }}>
                            <View style={{ alignItems:"center" }}>
                                <Image source={require("../assets/icons/appointment-list.png")} style={{ width:100, height:100 }}/>
                                <Text style={{marginBottom: 10, marginTop:10, color:"#969696", textAlign:"center"}}>Patients Appointment List</Text>
                            </View>
                        </Card>
                    </TouchableOpacity>
                </View>
                <View style={{flex:1, flexDirection:"row", paddingBottom:20}}>
                    <TouchableOpacity style={{ flex:1}} onPress={()=>{ this.routeScreen("MyProfileInformationScreen") }} activeOpacity={0.8}>
                        <Card containerStyle={{ borderRadius:20 }}>
                            <View style={{ alignItems:"center" }}>
                                <Image source={require("../assets/icons/my-profile.png")} style={{ width:100, height:100}}/>
                                <Text style={{marginBottom: 10, marginTop:10, color:"#969696", textAlign:"center"}}>My Profile</Text>
                            </View>
                        </Card>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex:1}} onPress={()=>{ this.logout() }} activeOpacity={0.8}>
                        <Card containerStyle={{ borderRadius:20 }}>
                            <View style={{ alignItems:"center" }}>
                                <Image source={require("../assets/icons/logout.png")} style={{ width:100, height:100 }}/>
                                <Text style={{marginBottom: 10, marginTop:10, color:"#969696", textAlign:"center"}}>Logout</Text>
                            </View>
                        </Card>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    patientDashboard = () => {
        return(
            <View style={{ flex: 1, flexDirection:"column" }}>
                <View style={{flex:1, flexDirection:"row", paddingBottom:20}}>
                    <TouchableOpacity style={{ flex:1}} onPress={()=>{ this.routeScreen("SearchDoctorScreen") }} activeOpacity={0.8}>
                        <Card containerStyle={{ borderRadius:20 }}>
                            <View style={{ alignItems:"center" }}>
                                <Image source={require("../assets/icons/make-appointment.png")} style={{ width:100, height:100 }}/>
                                <Text style={{marginBottom: 10, marginTop:10, color:"#969696", textAlign:"center"}}>Make Appointment</Text>
                            </View>
                        </Card>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex:1}} onPress={()=>{ this.routeScreen("MyAppointmentListScreen") }} activeOpacity={0.8}>
                        <Card containerStyle={{ borderRadius:20 }}>
                            <View style={{ alignItems:"center" }}>
                                <Image source={require("../assets/icons/my-appointments.png")} style={{ width:100, height:100 }}/>
                                <Text style={{marginBottom: 10, marginTop:10, color:"#969696", textAlign:"center"}}>My Appointments</Text>
                            </View>
                        </Card>
                    </TouchableOpacity>
                </View>
                <View style={{flex:1, flexDirection:"row", paddingBottom:20}}>
                    <TouchableOpacity style={{ flex:1}} onPress={()=>{ this.routeScreen("PatientBedListScreen") }} activeOpacity={0.8}>
                        <Card containerStyle={{ borderRadius:20 }}>
                            <View style={{ alignItems:"center" }}>
                                <Image source={require("../assets/icons/bed-management.png")} style={{ width:100, height:100}}/>
                                <Text style={{marginBottom: 10, marginTop:10, color:"#969696", textAlign:"center"}}>Book Bed</Text>
                            </View>
                        </Card>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex:1}} onPress={()=>{ this.routeScreen("PatientReservedBedScreen") }} activeOpacity={0.8}>
                        <Card containerStyle={{ borderRadius:20 }}>
                            <View style={{ alignItems:"center" }}>
                                <Image source={require("../assets/icons/reserved-bed.png")} style={{ width:100, height:100}}/>
                                <Text style={{marginBottom: 10, marginTop:10, color:"#969696", textAlign:"center"}}>My Reserved Bed</Text>
                            </View>
                        </Card>
                    </TouchableOpacity>
                </View>
                <View style={{flex:1, flexDirection:"row", paddingBottom:20}}>
                    <TouchableOpacity style={{ flex:1}} onPress={()=>{ this.routeScreen("PatientBloodBankScreen") }} activeOpacity={0.8}>
                        <Card containerStyle={{ borderRadius:20 }}>
                            <View style={{ alignItems:"center" }}>
                                <Image source={require("../assets/icons/blood-bank.png")} style={{ width:100, height:100}}/>
                                <Text style={{marginBottom: 10, marginTop:10, color:"#969696", textAlign:"center"}}>Blood Bank</Text>
                            </View>
                        </Card>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex:1}} onPress={()=>{ this.routeScreen("PatientDonateBloodScreen") }} activeOpacity={0.8}>
                        <Card containerStyle={{ borderRadius:20 }}>
                            <View style={{ alignItems:"center" }}>
                                <Image source={require("../assets/icons/donate-blood.png")} style={{ width:100, height:100}}/>
                                <Text style={{marginBottom: 10, marginTop:10, color:"#969696", textAlign:"center"}}>Donate Blood</Text>
                            </View>
                        </Card>
                    </TouchableOpacity>
                </View>
                <View style={{flex:1, flexDirection:"row", paddingBottom:20}}>
                    <TouchableOpacity style={{ flex:1}} onPress={()=>{ this.routeScreen("PatientAmbulanceServiceScreen") }} activeOpacity={0.8}>
                        <Card containerStyle={{ borderRadius:20 }}>
                            <View style={{ alignItems:"center" }}>
                                <Image source={require("../assets/icons/ambulance.png")} style={{ width:100, height:100}}/>
                                <Text style={{marginBottom: 10, marginTop:10, color:"#969696", textAlign:"center"}}>Ambulance Service</Text>
                            </View>
                        </Card>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex:1}} onPress={()=>{ this.routeScreen("MyProfileInformationScreen") }} activeOpacity={0.8}>
                        <Card containerStyle={{ borderRadius:20 }}>
                            <View style={{ alignItems:"center" }}>
                                <Image source={require("../assets/icons/my-profile.png")} style={{ width:100, height:100}}/>
                                <Text style={{marginBottom: 10, marginTop:10, color:"#969696", textAlign:"center"}}>My Profile</Text>
                            </View>
                        </Card>
                    </TouchableOpacity>
                </View>
                <View style={{flex:1, flexDirection:"row", paddingBottom:20}}>
                    <TouchableOpacity style={{ flex:1}} onPress={()=>{ this.logout() }} activeOpacity={0.8}>
                        <Card containerStyle={{ borderRadius:20 }}>
                            <View style={{ alignItems:"center" }}>
                                <Image source={require("../assets/icons/logout.png")} style={{ width:100, height:100 }}/>
                                <Text style={{marginBottom: 10, marginTop:10, color:"#969696", textAlign:"center"}}>Logout</Text>
                            </View>
                        </Card>
                    </TouchableOpacity>
                    <View style={{flex:1}}></View>
                </View>
            </View>
        );
    }

    logout = async() => {
        this.setState({spinner:true, spinnerTitle:"logging out.."});
        await AsyncStorage.multiRemove([STORAGE_PASS, STORAGE_EMAIL]);
        this.props.navigation.replace("LoginScreen");
    }

    routeScreen = (screen) => {
        this.props.navigation.navigate(screen);
    }

    render(){
        return(
            <View style={{ flex:1 }}>
                <StatusBar barStyle="dark-content" backgroundColor="#fff" />
                {
                    this.state.spinner?
                        <Spinner visible={this.state.spinner} overlayColor="#3578e5" textContent={this.state.spinnerTitle} textStyle={{color: '#FFF'}}/>
                    :
                        <ScrollView style={{ flex: 1, backgroundColor:"#fff" }}>
                            <View style={{height:150, flex:1, flexDirection:"row"}}>
                                <View style={{ flex:1, alignItems:"flex-start", justifyContent:"center", padding:20}}>
                                    <Text style={{ fontSize:26, fontWeight:"bold",}}>Hi {this.state.fullname},</Text>
                                    <Text style={{ fontSize:14, marginTop:10 }}>{this.state.appSlogan}</Text>
                                </View>
                                <View style={{ flex:1, alignItems:"center", justifyContent:"center"}}>
                                    <Avatar size="large" rounded titleStyle={{color: "#000"}} title={ Utils.getTwoCharacterFromString(this.state.fullname) } containerStyle={{ borderColor:"#b3b3b3", borderWidth:2 }}/>
                                </View>
                            </View>
                            <Divider style={{alignSelf:"center"}} width="60%" backgroundColor="#aeaeaed1"/>
                            { this.dashboard() }
                        </ScrollView>
                }
            </View>
        );
    }
}