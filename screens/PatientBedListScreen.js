import React from 'react';
import { View, StatusBar, FlatList } from 'react-native';
import { Text, ListItem, Avatar, Button, Icon} from 'react-native-elements';
import Utils  from '../modules/Utils';

export default class PatientBedListScreen extends React.Component{
    state = {
        spinnerTitle: "loading..",
        spinner: false,
        refreshing:false,

        bedList: [],
    }

    componentDidMount = () => {
        this.loadBedList();
    }    
    
    loadBedList = async() => {
        try{
            this.setState({refreshing:true, spinner:true, spinnerTitle:"loading bed list.."});
            const url = Utils.serverUrl() + "bed-management-patient-list";
            const response = await fetch(url);
            const json = await response.json();
            let _data = [];
            if(json.status == 200){
                for(var data of json.content){
                    _data.push({ 
                        id: data.bedDetails._id, 
                        title: data.bedDetails.title, 
                        total: data.bedDetails.total, 
                        rate: data.bedDetails.rate, 
                        created_at: data.bedDetails.created_at,
                        reserved: data.reservedSize,
                        available: parseInt(data.bedDetails.total) - parseInt(data.reservedSize)
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

    itemComponent = ({item}) => {
        return(
            <ListItem style={{ padding:2, margin:2 }} bottomDivider onPress={() => { this.props.navigation.navigate("PatientBookBedScreen", item) }}>
                <Avatar source={require('../assets/icons/bed-management.png')} size="medium" />
                <ListItem.Content>
                    <ListItem.Title>Name: { item.title }</ListItem.Title>
                    <ListItem.Subtitle>Bed: { item.reserved } / { item.total }</ListItem.Subtitle>
                    <ListItem.Subtitle>Available: { item.available }</ListItem.Subtitle>
                    <ListItem.Subtitle>Rate: Rs.{ item.rate }/- per bed</ListItem.Subtitle>
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
                        this.state.bedList.length <= 0?
                            <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
                                <Text>List not found.</Text>
                                <Button containerStyle={{padding:5, margin:10}} type="outline" title="reload" onPress={this.loadBedList} icon={{ type:"material-community", name:"reload", size:14 }}/>
                            </View>
                        :
                            <FlatList 
                                style={{flex: 1}}
                                data={this.state.bedList} 
                                renderItem={this.itemComponent} 
                                keyExtractor={ item => item.id } 
                                onRefresh={this.loadBedList}
                                refreshing={this.state.refreshing}
                            />
                }
            </View>
        );
    }
}