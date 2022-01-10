import React from 'react';
import { View, StatusBar, FlatList } from 'react-native';
import { Text, ListItem, Avatar, Button, Icon} from 'react-native-elements';
import Utils  from '../modules/Utils';

export default class DoctorListScreen extends React.Component{
    state = {
        spinnerTitle: "loading..",
        spinner: false,

        refreshing:false,
        doctorList: [],
    }

    componentDidMount = () => {
        this.loadDoctorList();
    }    
    
    loadDoctorList = async() => {
        try{
            this.setState({refreshing:true, spinner:true, spinnerTitle:"loading doctor list.."});
            const url = Utils.serverUrl() + "list-doctor";
            const response = await fetch(url);
            const json = await response.json();
            let _data = [];
            if(json.status == 200){
                for(var data of json.content){
                    _data.push({ id: data._id, academic: data.academic, address: data.address, blood: data.blood, department: data.department, email: data.email, 
                        fullname: data.fullname, gender: data.gender, phone: data.phone, photo: data.photo, prefix: data.prefix, charge: data.charge
                    });
                }
            }
            else Alert.alert("Error", json.content);
            this.setState({spinner:false, doctorList: _data, refreshing:false});
        }
        catch(error){
            console.error(error);
        }
    }

    itemComponent = ({item}) => {
        return(
            <ListItem style={{ padding:2, margin:2 }} bottomDivider onPress={() => { this.props.navigation.navigate("DoctorProfileInformationScreen", item) }}>
                <Avatar source={{ uri: item.photo }} size="large" rounded/>
                <ListItem.Content>
                    <ListItem.Title>Name: { item.fullname }</ListItem.Title>
                    <ListItem.Subtitle>Work At: { item.department }</ListItem.Subtitle>
                    <ListItem.Subtitle>Email: { item.email }</ListItem.Subtitle>
                    <ListItem.Subtitle>Gender: { item.gender }</ListItem.Subtitle>
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
                        this.state.doctorList.length <= 0?
                            <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
                                <Text>List not found.</Text>
                                <Button containerStyle={{padding:5, margin:10}} type="outline" title="reload" onPress={this.loadDoctorList} icon={{ type:"material-community", name:"reload", size:14 }}/>
                            </View>
                        :
                            <FlatList 
                                style={{flex: 1}}
                                data={this.state.doctorList} 
                                renderItem={this.itemComponent} 
                                keyExtractor={ item => item.id } 
                                onRefresh={this.loadDoctorList}
                                refreshing={this.state.refreshing}
                            />
                }
                <View style={{ position:"absolute", bottom:10, right:10 }}>
                    <Icon size={28} raised name='add-outline' type='ionicon' color='#3578e5' onPress={() => { this.props.navigation.navigate("RegisterDoctorScreen") } } />
                </View>
            </View>
        );
    }
}