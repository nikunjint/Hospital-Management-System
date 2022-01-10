import React from 'react';
import { View, StatusBar, FlatList } from 'react-native';
import { Text, ListItem, Avatar } from 'react-native-elements';
import Utils from '../modules/Utils';
import moment from 'moment';

export default class PatientReservedBedScreen extends React.Component{
    state = {
        spinnerTitle: "loading..",
        spinner: false,

        refreshing:false,
        myBedList: [],
    }

    componentDidMount = () => {
        this.loadMyReservedBedList();
    }    

    loadMyReservedBedList = async() => {
        try{
            this.setState({refreshing:true, spinner:true, spinnerTitle:"loading reserved bed list.."});
            const url = Utils.serverUrl() + "bed-management-my-reserved-bed-list?patientId=" + global.id;
            const response = await fetch(url);
            const json = await response.json();
            let _data = [];
            if(json.status == 200){
                for(var data of json.reservedBeds){
                    _data.push({
                        id: data.reservedBed._id,
                        bedTitle: data.bedInfo.title,
                        bedId: data.bedInfo._id,
                        created_at: data.reservedBed.created_at,
                        created_at_str: moment(data.reservedBed.created_at).format("DD MMM YYYY [at] hh:mm a"),
                        isReserved: data.reservedBed.isReserved,
                        patientId: data.reservedBed.patientId,
                        rate: data.reservedBed.rate,
                        paymentMethod: data.reservedBed.paymentMethod
                    });
                }
            }
            else Alert.alert("Error", json.content);
            this.setState({refreshing:false, spinner:false, myBedList: _data});
        }
        catch(error){
            console.error(error);
        }
    }

    itemComponent = ({item}) => {
        return(
            <ListItem style={{ padding:2, margin:2 }} bottomDivider>
                <Avatar source={ require('../assets/icons/bed-management.png') } size="large"/>
                <ListItem.Content>
                    <ListItem.Title>{ item.bedTitle }</ListItem.Title>
                    <ListItem.Subtitle>Rate: Rs.{ item.rate }/-</ListItem.Subtitle>
                    <ListItem.Subtitle>Payment Method: { item.paymentMethod }</ListItem.Subtitle>
                    <ListItem.Subtitle>Booked At: { item.created_at_str }</ListItem.Subtitle>
                </ListItem.Content>
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
                        this.state.myBedList.length <= 0?
                            <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
                                <Text>List not found.</Text>
                            </View>
                        :
                            <FlatList
                                style={{flex: 1}}
                                onRefresh={this.loadMyReservedBedList}
                                refreshing={this.state.refreshing}
                                data={this.state.myBedList} 
                                renderItem={this.itemComponent} 
                                keyExtractor={ item => item.id } 
                            />
                }
            </View>
        );
    }
}