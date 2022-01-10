import React from 'react';
import { View, StatusBar, FlatList } from 'react-native';
import { Text, ListItem, Icon, Button} from 'react-native-elements';
import Utils  from '../modules/Utils';
import moment from 'moment';

export default class ManagementAppointmentScreen extends React.Component{
    state = {
        spinnerTitle: "loading..",
        spinner: false,

        refreshing:false,
        appointmentList: [],
    }

    componentDidMount = () => {
        this.loadAppointmentList();
    }    

    loadAppointmentList = async() => {
        try{
            this.setState({refreshing:true, spinner:true, spinnerTitle:"loading appointment list.."});
            const url = Utils.serverUrl() + "doctor-list-appointment?doctorId=" + global.id +"&now=" + Date.now();
            const response = await fetch(url);
            const json = await response.json();
            let _data = [];
            if(json.status == 200){
                for(var data of json.content){
                    const startDate_str = moment(data.startDate).format("DD MMM YYYY [at] hh:mm a");
                    const endDate_str = moment(data.endDate).format("DD MMM YYYY [at] hh:mm a");
                    _data.push({ id: data._id, startDate: data.startDate, startDate_str: startDate_str, endDate: data.endDate, endDate_str: endDate_str, created_at:data.created_at });
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
        return(
            <ListItem style={{ padding:2, margin:2 }} bottomDivider onPress={() => { this.props.navigation.navigate("Edit_AppointmentMakerScreen", item) }}>
                <Icon type="material-community" name="calendar-month"/>
                <ListItem.Content>
                    <ListItem.Title>Appointment Date</ListItem.Title>
                    <ListItem.Subtitle>Start: { item.startDate_str }</ListItem.Subtitle>
                    <ListItem.Subtitle>End: { item.endDate_str }</ListItem.Subtitle>
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
                    this.state.spinner?
                        <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
                            <Text>{this.state.spinnerTitle}</Text>
                        </View>
                    :
                        this.state.appointmentList.length <= 0?
                            <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
                                <Text>List not found.</Text>
                                <Button containerStyle={{padding:5, margin:10}} type="outline" title="reload" onPress={this.loadAppointmentList} icon={{ type:"material-community", name:"reload", size:14 }}/>
                            </View>
                        :
                            <FlatList 
                                style={{flex: 1}}
                                data={this.state.appointmentList} 
                                renderItem={this.itemComponent}
                                keyExtractor={item => item.id.toString()} 
                                refreshing={this.state.refreshing}
                                onRefresh={this.loadAppointmentList}
                            />
                }
                <View style={{ position:"absolute", bottom:10, right:10 }}>
                    <Icon size={28} raised name='add-outline' type='ionicon' color='#3578e5' onPress={() => { this.props.navigation.navigate("Create_AppointmentMakerScreen") } } />
                </View>
            </View>
        );
    }
}