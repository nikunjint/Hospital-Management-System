import React from 'react';
import { View, StatusBar, FlatList } from 'react-native';
import { Text, ListItem, Avatar, Icon, Button } from 'react-native-elements';
import Utils from '../modules/Utils';
import moment from 'moment';

export default class PatientsAppointmentListScreen extends React.Component{
    state = {
        spinnerTitle: "loading..",
        spinner: false,

        refreshing:false,
        patientsAppointmentList: [],
    }

    componentDidMount = () => {
        this.loadPatientsAppointmentList();
    }    

    loadPatientsAppointmentList = async() => {
        try{
            this.setState({refreshing:true, spinner:true, spinnerTitle:"loading patient appointment list.."});
            const url = Utils.serverUrl() + "doctor-list-appointment-patient?doctorId=" + global.id;
            const response = await fetch(url);
            const json = await response.json();
            let _data = [];
            if(json.status == 200){
                for(var data of json.reservedAppointments){
                    _data.push({ 
                        id: data.reservedAppointment._id, appointmentId: data.reservedAppointment.appointmentId, 
                        pid: data.patientDetail._id, email: data.patientDetail.email, fullname: data.patientDetail.fullname, gender: data.patientDetail.gender,
                        reservedAt: data.reservedAppointment.reservedAt, image: data.patientDetail.photo,
                        startDate: data.appointmentDetails.startDate,
                        startDate_str: moment(data.appointmentDetails.startDate).format("DD MMM YYYY [at] hh:mm a"),
                        endDate: data.appointmentDetails.endDate,
                        endDate_str: moment(data.appointmentDetails.endDate).format("DD MMM YYYY [at] hh:mm a"),
                        result: data
                    });
                }
            }
            else Alert.alert("Error", json.content);
            this.setState({refreshing:false, spinner:false, patientsAppointmentList: _data});
        }
        catch(error){
            console.error(error);
        }
    }

    itemComponent = ({item}) => {
        return(
            <ListItem style={{ padding:2, margin:2 }} bottomDivider onPress={() => { this.props.navigation.navigate("PatientAppointmentDetailScreen", item) }}>
                { item.image==""? <Avatar source={require("../assets/icons/image-not-found.png")} rounded size="large"/> : <Avatar source={{ uri: item.image }} rounded size="large"/> }
                <ListItem.Content>
                    <ListItem.Title>{ item.fullname }</ListItem.Title>
                    <ListItem.Subtitle>{ item.email }</ListItem.Subtitle>
                    <ListItem.Subtitle>{ item.startDate_str }</ListItem.Subtitle>
                    <ListItem.Subtitle>{ item.endDate_str }</ListItem.Subtitle>
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
                        this.state.patientsAppointmentList.length <= 0?
                            <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
                                <Text>List not found.</Text>
                                <Button containerStyle={{padding:5, margin:10}} type="outline" title="reload" onPress={this.loadPatientsAppointmentList} icon={{ type:"material-community", name:"reload", size:14 }}/>
                            </View>
                        :
                            <FlatList
                                style={{flex: 1}}
                                onRefresh={this.loadPatientsAppointmentList}
                                refreshing={this.state.refreshing}
                                data={this.state.patientsAppointmentList} 
                                renderItem={this.itemComponent} 
                                keyExtractor={ item => item.id } 
                            />
                }
            </View>
        );
    }
}