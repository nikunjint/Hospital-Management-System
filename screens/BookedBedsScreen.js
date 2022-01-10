import React from 'react';
import { View, StatusBar, FlatList, Alert } from 'react-native';
import { Text, ListItem, Avatar, Button, Icon} from 'react-native-elements';
import Utils  from '../modules/Utils';
import moment from 'moment';

export default class BookedBedsScreen extends React.Component{
    state = {
        spinnerTitle: "loading..",
        spinner: false,

        refreshing:false,
        bedList: [],
    }

    componentDidMount = () => {
        this.loadBookedBedList();
    }    
    
    loadBookedBedList = async() => {
        try{
            this.setState({refreshing:true, spinner:true, spinnerTitle:"loading booked bed list.."});
            const url = Utils.serverUrl() + "booked-bed-list";
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
                        paymentMethod: data.reservedBed.paymentMethod,
                        result: data
                    });
                }
            }
            else Alert.alert("Error", json.content);
            this.setState({spinner:false, bedList: _data, refreshing:false});
        }
        catch(error){
            console.error(error);
        }
    }

    removeBed = (item) => {
        const removeInfo = async(item) => {
            try{
                const id = item.result.reservedBed._id;
                this.setState({ spinner:true, spinnerTitle: "removing patient reserved bed.."});
                const url = Utils.serverUrl() + "booked-bed-remove?id=" + id;
                const response = await fetch(url);
                const json = await response.json();
                if(json.status == 200){
                    Alert.alert("Info", json.content);
                    this.loadBookedBedList();
                }
                else Alert.alert("Error", json.content);
                this.setState({spinner:false});
            }
            catch(error){
                this.setState({spinner:false});
                console.error(error);
            }
        }

        Alert.alert("Warning!", "Are you sure want to remove?", [ { text: "Cancel", style: "cancel" }, { text: "Yes", onPress: () => removeInfo(item) } ] );
    }

    getBookedInformation = (item) => {
        const data = "Patient Name: " + item.result.patientDetails.fullname + "\nEmail: " + item.result.patientDetails.email + "\nPhone: " + item.result.patientDetails.phone + "\nAddress: " + item.result.patientDetails.address;
        Alert.alert("Info", data);
    }

    itemComponent = ({item}) => {
        return(
            <ListItem style={{ padding:2, margin:2 }} bottomDivider onPress={() => this.getBookedInformation(item)} onLongPress={() => this.removeBed(item)}>
                <Avatar source={require('../assets/icons/bed-management.png')} size="large"/>
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
                    this.state.spinner?
                        <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
                            <Text>{this.state.spinnerTitle}</Text>
                        </View>
                    :
                        this.state.bedList.length <= 0?
                            <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
                                <Text>List not found.</Text>
                                <Button containerStyle={{padding:5, margin:10}} type="outline" title="reload" onPress={this.loadDoctorList} icon={{ type:"material-community", name:"reload", size:14 }}/>
                            </View>
                        :
                            <FlatList 
                                style={{flex: 1}}
                                data={this.state.bedList} 
                                renderItem={this.itemComponent} 
                                keyExtractor={ item => item.id } 
                                onRefresh={this.loadBookedBedList}
                                refreshing={this.state.refreshing}
                            />
                }
            </View>
        );
    }
}