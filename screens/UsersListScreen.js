import React from 'react';
import { View, StatusBar, FlatList } from 'react-native';
import { Text, ListItem, Avatar, Button } from 'react-native-elements';
import Utils from '../modules/Utils';
import Toast from 'react-native-simple-toast';

export default class UsersListScreen extends React.Component{
    state = {
        spinnerTitle: "loading..",
        spinner: false,

        refreshing:false,
        usersList: [],
    }

    componentDidMount = () => {
        this.loadUsersList();
    }    

    loadUsersList = async() => {
        try{
            this.setState({refreshing:true, spinner:true, spinnerTitle:"loading users list.."});
            const url = Utils.serverUrl() + "list-users";
            const response = await fetch(url);
            const json = await response.json();
            let _data = [];
            if(json.status == 200){
                for(var data of json.content){
                    _data.push({ id: data._id, academic: data.academic, address: data.address, blood: data.blood, department: data.department, email: data.email, 
                        fullname: data.fullname, gender: data.gender, phone: data.phone, photo: data.photo, prefix: data.prefix, type: data.type
                    });
                }
            }
            else Alert.alert("Error", json.content);
            this.setState({refreshing:false, spinner:false, usersList: _data});
        }
        catch(error){
            console.error(error);
        }
    }

    loadProfile = (item) => {
        if(item.type == "DOCTOR"){
            this.props.navigation.navigate("DoctorProfileInformationScreen", item);
        }
        else if(item.type == "PATIENT"){
            this.props.navigation.navigate("UserProfileInformationScreen", item);
        }
        else if(item.type == "ADMIN"){
            Toast.show("This information only can view by it's owner.", Toast.SHORT);
        }
    }

    itemComponent = ({item}) => {
        return(
            <ListItem style={{ padding:2, margin:2 }} bottomDivider onPress={() => { this.loadProfile(item) }}>
                { item.photo==""? <Avatar source={require("../assets/icons/image-not-found.png")} size="large" rounded /> : <Avatar source={{ uri: item.photo}} size="large" rounded /> }
                <ListItem.Content>
                    <ListItem.Title>Name: { item.fullname }</ListItem.Title>
                    <ListItem.Subtitle>Email: { item.email }</ListItem.Subtitle>
                    <ListItem.Subtitle>Type: { item.type }</ListItem.Subtitle>
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
                        this.state.usersList.length <= 0?
                            <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
                                <Text>List not found.</Text>
                                <Button containerStyle={{padding:5, margin:10}} type="outline" title="reload" onPress={this.loadDoctorList} icon={{ type:"material-community", name:"reload", size:14 }}/>
                            </View>
                        :
                            <FlatList 
                                style={{flex: 1}}
                                data={this.state.usersList} 
                                renderItem={this.itemComponent}
                                keyExtractor={ item => item.id }
                                refreshing={ this.state.refreshing }
                                onRefresh={ this.loadUsersList }
                            />
                }
            </View>
        );
    }
}