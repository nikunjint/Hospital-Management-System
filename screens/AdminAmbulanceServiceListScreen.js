import React from 'react';
import { View, StatusBar, Alert, FlatList } from 'react-native';
import { Text, Button, ListItem, Icon } from 'react-native-elements';
import Utils from '../modules/Utils';
import Toast from 'react-native-simple-toast';

export default class AdminAmbulanceServiceListScreen extends React.Component{
    state = {
        spinnerTitle: "loading..",
        spinner: false,
        refreshing:false,

        ambulanceList: [],
    }

    componentDidMount = () => {
        this.loadAmbulanceList();
    }    
    
    loadAmbulanceList = async() => {
        try{
            this.setState({refreshing:true, spinner:true, spinnerTitle:"loading ambulance list.."});
            const url = Utils.serverUrl() + "ambulance-service";
            const response = await fetch(url);
            const json = await response.json();
            let _data = [];
            if(json.status == 200){
                for(var data of json.content){
                    _data.push({ 
                        id: data._id,
                        service_name: data.service_name,
                        phone: data.phone,
                        mobile: data.mobile,
                        email: data.email,
                        website: data.website,
                    });
                }
            }
            else Alert.alert("Error", json.content);
            this.setState({spinner:false, ambulanceList: _data, refreshing:false});
        }
        catch(error){
            console.error(error);
        }
    }

    itemComponent = ({item}) => {
        return(
            <ListItem style={{ padding:2, margin:2 }} bottomDivider onLongPress={()=>this.remove(item)} onPress={() => Utils.handleUrl(item.website)}>
                <ListItem.Content>
                    <ListItem.Title>Service Name: { item.service_name }</ListItem.Title>
                    <ListItem.Subtitle>Phone: { item.phone }</ListItem.Subtitle>
                    <ListItem.Subtitle>Mobile: { item.mobile }</ListItem.Subtitle>
                    <ListItem.Subtitle>Email: { item.email }</ListItem.Subtitle>
                    <ListItem.Subtitle>Website: { item.website }</ListItem.Subtitle>
                </ListItem.Content>
            </ListItem>
        );
    }

    remove = (item) => {
        const removeAmbulanceService = async(item) => {
            try{
                this.setState({spinner:true, spinnerTitle:"removing ambulance service info..", refreshing:true});
                const url = Utils.serverUrl() + "remove-ambulance-service?id=" + item.id;
                const response = await fetch(url);
                const json = await response.json();
                if(json.status == 200){
                    const data = json.content;
                    Toast.show(data, Toast.SHORT);
                }
                else Alert.alert("Error", json.content);
                this.setState({spinner:false, refreshing:false});
                this.loadAmbulanceList();
            }
            catch(error){
                console.error(error);
            }
        }

        Alert.alert("Warning!", "Are you sure want to remove?", [ { text: "Cancel", style: "cancel" }, { text: "Yes", onPress: () => removeAmbulanceService(item) } ] );
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
                        this.state.ambulanceList.length <= 0?
                            <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
                                <Text>List not found.</Text>
                                <Button containerStyle={{padding:5, margin:10}} type="outline" title="reload" onPress={this.loadAmbulanceList} icon={{ type:"material-community", name:"reload", size:14 }}/>
                            </View>
                        :
                            <FlatList 
                                style={{flex: 1}}
                                data={this.state.ambulanceList} 
                                renderItem={this.itemComponent} 
                                keyExtractor={ item => item.id } 
                                onRefresh={this.loadAmbulanceList}
                                refreshing={this.state.refreshing}
                            />
                }
                <View style={{ position:"absolute", bottom:10, right:10 }}>
                    <Icon size={28} raised name='add-outline' type='ionicon' color='#3578e5' onPress={() => { this.props.navigation.navigate("AdminAmbulanceServiceMakerScreen") } } />
                </View>
            </View>
        );
    }
}