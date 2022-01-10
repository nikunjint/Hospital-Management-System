import React from 'react';
import { View, StatusBar, Alert, FlatList } from 'react-native';
import { Text, Button, ListItem, Avatar} from 'react-native-elements';
import Utils from '../modules/Utils';

export default class PatientBloodBankScreen extends React.Component{
    state = {
        spinnerTitle: "loading..",
        spinner: false,
        refreshing:false,

        boodBankList: [],
    }

    componentDidMount = () => {
        this.loadBloodBankList();
    }    
    
    loadBloodBankList = async() => {
        try{
            this.setState({refreshing:true, spinner:true, spinnerTitle:"loading blood bank list.."});
            const url = Utils.serverUrl() + "blood-banks";
            const response = await fetch(url);
            const json = await response.json();
            let _data = [];
            if(json.status == 200){
                for(var data of json.content){
                    _data.push({ 
                        id: data._id,
                        bank_name: data.bank_name,
                        phone: data.phone,
                        mobile: data.mobile,
                        email: data.email,
                        website: data.website,
                    });
                }
            }
            else Alert.alert("Error", json.content);
            this.setState({spinner:false, boodBankList: _data, refreshing:false});
        }
        catch(error){
            console.error(error);
        }
    }

    itemComponent = ({item}) => {
        return(
            <ListItem style={{ padding:2, margin:2 }} bottomDivider onPress={() => Utils.handleUrl(item.website)}>
                <ListItem.Content>
                    <ListItem.Title>Bank Name: { item.bank_name }</ListItem.Title>
                    <ListItem.Subtitle>Phone: { item.phone }</ListItem.Subtitle>
                    <ListItem.Subtitle>Mobile: { item.mobile }</ListItem.Subtitle>
                    <ListItem.Subtitle>Email: { item.email }</ListItem.Subtitle>
                    <ListItem.Subtitle>Website: { item.website }</ListItem.Subtitle>
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
                        this.state.boodBankList.length <= 0?
                            <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
                                <Text>List not found.</Text>
                                <Button containerStyle={{padding:5, margin:10}} type="outline" title="reload" onPress={this.loadBloodBankList} icon={{ type:"material-community", name:"reload", size:14 }}/>
                            </View>
                        :
                            <FlatList 
                                style={{flex: 1}}
                                data={this.state.boodBankList} 
                                renderItem={this.itemComponent} 
                                keyExtractor={ item => item.id } 
                                onRefresh={this.loadBloodBankList}
                                refreshing={this.state.refreshing}
                            />
                }
            </View>
        );
    }
}