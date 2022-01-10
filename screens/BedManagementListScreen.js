import React from 'react';
import { View, StatusBar, FlatList } from 'react-native';
import { Text, ListItem, Avatar, Button, Icon} from 'react-native-elements';
import Utils  from '../modules/Utils';

export default class BedManagementListScreen extends React.Component{
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
            this.setState({ refreshing:true, spinner:true, spinnerTitle:"loading bed list.." });
            const url = Utils.serverUrl() + "bed-management-list";
            const response = await fetch(url);
            const json = await response.json();
            let _data = [];
            if(json.status == 200){
                for(var data of json.content){
                    _data.push({ id: data._id, title: data.title, total: data.total, rate: data.rate });
                }
            }
            else Alert.alert("Error", json.content);
            this.setState({ refreshing:false, spinner:false, bedList: _data });
        }
        catch(error){
            console.error(error);
        }
    }

    itemComponent = ({item}) => {
        return(
            <ListItem style={{ padding:2, margin:2 }} bottomDivider onPress={() => { this.props.navigation.navigate("Edit_BedMakerScreen", item) }}>
                <Avatar source={require('../assets/icons/bed-management.png')} size="medium"/>
                <ListItem.Content>
                    <ListItem.Title>Bed Title: { item.title }</ListItem.Title>
                    <ListItem.Subtitle>Total No.: { item.total }</ListItem.Subtitle>
                    <ListItem.Subtitle>Charge: Rs.{ item.rate }/-</ListItem.Subtitle>
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
                                data={this.state.bedList}
                                renderItem={this.itemComponent}
                                keyExtractor={ item => item.id }
                                onRefresh={this.loadBedList}
                                refreshing={this.state.refreshing}
                            />
                }
                <View style={{ position:"absolute", bottom:10, right:10 }}>
                    <Icon size={28} raised name='add-outline' type='ionicon' color='#3578e5' onPress={() => { this.props.navigation.navigate("Add_BedMakerScreen") } } />
                </View>
            </View>
        );
    }
}