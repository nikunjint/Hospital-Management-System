import React from 'react';
import { View, StatusBar, FlatList } from 'react-native';
import { Text, ListItem, Avatar, Icon, SearchBar} from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay'
import { Picker } from '@react-native-picker/picker';
import Utils from '../modules/Utils';

export default class SearchDoctorScreen extends React.Component{
    state = {
        spinnerTitle: "loading..",
        spinner: false,
        refreshing: false,
        doctorList: [],
        serverDoctorList: [],
        search: "",
        searching: false,
        filterContainer: false,
        departmentList: Utils.getDepartment(),
        department: "All Department",
    }

    componentDidMount(){
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
                    _data.push({ id: data._id, academic: data.academic, address: data.address, blood: data.blood, department: data.department, email: data.email, fullname: data.fullname, gender: data.gender, phone: data.phone, photo: data.photo, prefix: data.prefix, charge: data.charge});
                }
            }
            else Alert.alert("Error", json.content);
            this.setState({refreshing:false, spinner:false, serverDoctorList: _data, doctorList: _data});
        }
        catch(error){
            console.error(error);
        }
    }
   
    itemComponent = ({item}) => {
        return(
            <ListItem style={{ padding:2, margin:2 }} bottomDivider onPress={() => { this.props.navigation.navigate("SelectedDoctorAppointmentScreen", item) }}>
                <Avatar source={{ uri: item.photo }} size="large" rounded/>
                <ListItem.Content>
                    <ListItem.Title>Name: { item.prefix + " " + item.fullname }</ListItem.Title>
                    <ListItem.Subtitle>Department: { item.department }</ListItem.Subtitle>
                    <ListItem.Subtitle>Email: { item.email }</ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Chevron />
            </ListItem>
        );
    }

    filterDoctorList = (val) => {
        this.setState({search:val, searching:true});
        if(val.trim() != ""){
            let _data = [];
            for(const data of this.state.serverDoctorList){
                const result = Utils.searchStr(val, data.fullname);
                if(result >=0){
                    if(this.state.filterContainer && data.department == this.state.department)
                        _data.push({ id: data.id, academic: data.academic, address: data.address, blood: data.blood, department: data.department, email: data.email, fullname: data.fullname, gender: data.gender, phone: data.phone, photo: data.photo, prefix: data.prefix});
                    else
                        _data.push({ id: data.id, academic: data.academic, address: data.address, blood: data.blood, department: data.department, email: data.email, fullname: data.fullname, gender: data.gender, phone: data.phone, photo: data.photo, prefix: data.prefix});
                }
            }
            this.setState({ searching:false, doctorList: _data });
        }
        else{
            this.setState({ searching:false, doctorList: this.state.serverDoctorList });
        }
    } 

    openFilterContainer = () => {
        this.setState({filterContainer:!this.state.filterContainer});
    }

    closeFilterContainer = () => {
        this.setState({filterContainer:false});
    }

    render(){
        return(
            <View style={{ flex:1 }}>
                <StatusBar barStyle="dark-content" backgroundColor="#fff" />
                {
                    (!this.state.spinner)?
                        <SearchBar lightTheme placeholder="Filter doctor from list.." onChangeText={val => this.filterDoctorList(val) } value={this.state.search} />
                    :
                        null
                }
                {
                     (this.state.filterContainer)?
                        <View style={{marginLeft:10, marginRight:10}}>
                            <Picker selectedValue={this.state.department} style={{height:50}} onValueChange={(v,i)=>{ this.setState({department:v}); }}>
                                {
                                    this.state.departmentList.map((val, i) => {
                                        return(<Picker.Item key={i.toString()} label={val} value={val}/>);
                                    })
                                }
                            </Picker>
                        </View>
                    :
                        null
                }
                {
                    (this.state.spinner)?
                        <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
                            <Text>{this.state.spinnerTitle}</Text>
                        </View>
                    :
                        this.state.doctorList.length <= 0?
                            <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
                                { this.state.searching?<Text>searching...</Text>:<Text>List not found.</Text> }
                            </View>
                        :
                            <FlatList 
                                style={{flex: 1}}
                                data={this.state.doctorList} 
                                renderItem={this.itemComponent} 
                                keyExtractor={ item => item.id } 
                                refreshing={this.state.refreshing} 
                                onRefresh={this.loadDoctorList}/>
                }
            </View>
        );
    }
}