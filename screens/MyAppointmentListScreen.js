import React from 'react';
import { View, StatusBar, FlatList } from 'react-native';
import { Text, ListItem, Avatar } from 'react-native-elements';
import Utils from '../modules/Utils';
import moment from 'moment';

export default class MyAppointmentListScreen extends React.Component{
    state = {
        spinnerTitle: "loading..",
        spinner: false,

        refreshing:false,
        appointmentList: [],
    }

    componentDidMount = () => {
        this.loadAppointmentList();
    }    

    loadAppointmentList = async () => {
        try{
            this.setState({refreshing:true, spinner:true, spinnerTitle:"loading appointment list.."});
            const url = Utils.serverUrl() + "list-my-appointment?patientId=" + global.id;
            const response = await fetch(url);
            const json = await response.json();
            let _data = [];
            if(json.status == 200){
                for(var data of json.reservedAppointments){
                    _data.push({
                        id: data.reservedAppointment._id,
                        doc_id: data.doctorDetails._id,
                        doc_prefix: data.doctorDetails.prefix,
                        doc_name: data.doctorDetails.fullname, 
                        doc_image: data.doctorDetails.photo,
                        doc_charge: data.reservedAppointment.charge,
                       
                        startDate: data.appointmentDetails.startDate,
                        startDate_str: moment(data.appointmentDetails.startDate).format("DD MMM YYYY [at] hh:mm a"),
                        endDate: data.appointmentDetails.endDate,
                        endDate_str: moment(data.appointmentDetails.endDate).format("DD MMM YYYY [at] hh:mm a"),
                        isExpired: Date.now() > data.appointmentDetails.endDate,
                        isExaminedFinished: data.reservedAppointment.isExaminedFinished,
                        result: data
                    })
                }
            }
            else Alert.alert("Error", json.content);
            this.setState({refreshing:false, spinner:false, appointmentList: _data});
        }
        catch(error){
            console.error(error);
        }
    }

    itemComponent = ({item}) => {
        const appointmentItem = {
            appointment:{ id:item.result.appointmentDetails._id, startDate:item.result.appointmentDetails.startDate, endDate:item.result.appointmentDetails.endDate, startDate_str:item.startDate_str, endDate_str:item.endDate_str, remarks: item.result.reservedAppointment.remarks, paymentMethod: item.result.reservedAppointment.paymentMethod, isExpired: item.isExpired, isExaminedFinished: item.isExaminedFinished },
            doctor:{ id: item.result.doctorDetails._id, prefix: item.result.doctorDetails.prefix, fullname: item.result.doctorDetails.fullname, email: item.result.doctorDetails.email, phone: item.result.doctorDetails.phone, charge: item.doc_charge },
            isReadOnly: true
        };

        return(
            <ListItem style={{ padding:2, margin:2 }} bottomDivider onPress={() => { this.props.navigation.navigate("SelectedDoctorAppointmentDetailScreen", appointmentItem) }}>
                <Avatar source={{ uri: item.doc_image }} rounded size="large"/>
                <ListItem.Content>
                    <ListItem.Title>{ item.doc_prefix + " " + item.doc_name }</ListItem.Title>
                    <ListItem.Subtitle>Appointment Date</ListItem.Subtitle>
                    <ListItem.Subtitle>From: { item.startDate_str }</ListItem.Subtitle>
                    <ListItem.Subtitle>To: { item.endDate_str }</ListItem.Subtitle>
                    { item.isExpired?<ListItem.Subtitle style={{ color:"red" }}>Expired</ListItem.Subtitle>:null }
                    { item.isExaminedFinished?<ListItem.Subtitle style={{ color:"red" }}>Examined Finished</ListItem.Subtitle>:null }
                </ListItem.Content>
                <ListItem.Chevron />
            </ListItem>
        );
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
                        this.state.appointmentList.length <= 0?
                            <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
                                <Text>List not found.</Text>
                            </View>
                        :
                            <FlatList
                                style={{flex: 1}}
                                onRefresh={this.loadAppointmentList}
                                refreshing={this.state.refreshing}
                                data={this.state.appointmentList} 
                                renderItem={this.itemComponent} 
                                keyExtractor={ item => item.id } 
                            />
                }
            </View>
        );
    }
}