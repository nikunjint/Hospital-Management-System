import React from 'react';
import { View, StatusBar, FlatList } from 'react-native';
import { Text, ListItem, Button } from 'react-native-elements';
import Utils  from '../modules/Utils';

export default class AdminBloodDonationFormListScreen extends React.Component{
    state = {
        spinnerTitle: "loading..",
        spinner: false,

        refreshing:false,
        donorList: [],
    }

    componentDidMount = () => {
        this.loadDonorList();
    }    
    
    loadDonorList = async() => {
        try{
            this.setState({refreshing:true, spinner:true, spinnerTitle:"loading blood donation form list.."});
            const url = Utils.serverUrl() + "blood-donation-list";
            const response = await fetch(url);
            const json = await response.json();
            let _data = [];
            if(json.status == 200){
                for(var data of json.content){
                    _data.push({ 
                        id: data._id, patientId: data.patientId, fullName: data.fullName, email: data.email,gender: data.gender, 
                        blood: data.blood, phone: data.phone, address: data.address, donationDate: data.donationDate, created_at: data.created_at, 
                    });
                }
            }
            else Alert.alert("Error", json.content);
            this.setState({spinner:false, donorList: _data, refreshing:false});
        }
        catch(error){
            console.error(error);
        }
    }

    itemComponent = ({item}) => {
        return(
            <ListItem style={{ padding:2, margin:2 }} bottomDivider>
                <ListItem.Content>
                    <ListItem.Title>Name: { item.fullName }</ListItem.Title>
                    <ListItem.Subtitle>Email: { item.email }</ListItem.Subtitle>
                    <ListItem.Subtitle>Blood Group: { item.blood }</ListItem.Subtitle>
                    <ListItem.Subtitle>Gender: { item.gender }</ListItem.Subtitle>
                    <ListItem.Subtitle>Phone: { item.phone }</ListItem.Subtitle>
                    <ListItem.Subtitle>Address: { item.address }</ListItem.Subtitle>
                    <ListItem.Subtitle>Donation Date: { item.donationDate }</ListItem.Subtitle>
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
                        this.state.donorList.length <= 0?
                            <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
                                <Text>List not found.</Text>
                                <Button containerStyle={{padding:5, margin:10}} type="outline" title="reload" onPress={this.loadDonorList} icon={{ type:"material-community", name:"reload", size:14 }}/>
                            </View>
                        :
                            <FlatList 
                                data={this.state.donorList} 
                                renderItem={this.itemComponent} 
                                keyExtractor={ item => item.id } 
                                onRefresh={this.loadDonorList}
                                refreshing={this.state.refreshing}
                            />
                }
            </View>
        );
    }
}