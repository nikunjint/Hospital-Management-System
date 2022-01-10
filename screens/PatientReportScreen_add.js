import React from 'react';
import { View, StatusBar, FlatList } from 'react-native';
import { Text, ListItem, Icon, Button, Image, Avatar} from 'react-native-elements';
import Utils  from '../modules/Utils';
import moment from 'moment';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export default class PatientReportScreen_add extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            spinnerTitle: "loading..",
            spinner: false,
    
            uid: props.route.params.pid,
            aid: props.route.params.aid,
            mode: props.route.params.mode,
            refreshing: false,
            maxImage: 6,
            reportList: [],
        }
    }

    componentDidMount = () => {
        this.loadReportList();
    }    

    loadReportList = async() => {
        try{
            this.setState({refreshing:true, spinner:true, spinnerTitle:"loading report list.."});
            let url = "";
            if(this.state.mode == "VIEW"){ url = Utils.serverUrl() + "user-report?uid=" + global.id + "&aid=" + this.state.aid; }
            else if(this.state.mode == "ADD"){ url = Utils.serverUrl() + "user-report?uid=" + this.state.uid + "&aid=" + this.state.aid; }
            if(url == "") return;
            
            const response = await fetch(url);
            const json = await response.json();
            let _data = [];
            if(json.status == 200){
                for(var data of json.content){
                    _data.push({ id: data._id, base64Img: data.photo});
                }
            }
            else Alert.alert("Error", json.content);
            this.setState({refreshing:false, spinner:false, reportList: _data});
        }
        catch(error){
            console.error(error);
        }
    }
    
    removeImage = (item) => {
        if(this.state.mode == "VIEW") return;

        const removeInfo = async(item) => {
            this.setState({refreshing: true, spinner: true, spinnerTitle: "removing report.."});
            const url =  Utils.serverUrl() + "user-report-remove?id=" + item.id;
            const response = await fetch(url);
            const json = await response.json();
            if(json.status == 200) Alert.alert("Info", json.content);
            else Alert.alert("Error", json.content);
            this.setState({spinner:false, refreshing:false});
            this.loadReportList();
        }

        Alert.alert("Warning!", "Are you sure want to remove?", [ { text: "Cancel", style: "cancel" }, { text: "Yes", onPress: () => removeInfo(item) } ] );
    }

    itemComponent = ({item}) => {
        return(
            <ListItem style={{ width:"50%", height:200}} onPress={()=>{ this.props.navigation.navigate("ImageViewer", {photo: item.base64Img}) }} onLongPress={() => {this.removeImage(item) }}>
                <Avatar source={{ uri:item.base64Img }} width={"100%"} height={170}/>
            </ListItem>
        );
    }

    openImagePicker = async() => {
        if(this.state.reportList.length<this.state.maxImage){
            let result = await ImagePicker.launchImageLibraryAsync({allowsEditing: true, base64: true });
            if(!result.cancelled){ 
                this.setState({refreshing: true, spinner: true, spinnerTitle: "uploading report.."});
                const url =  Utils.serverUrl() + "user-report-add";
                const body = JSON.stringify({pid: this.state.uid, aid:this.state.aid, photo: `data:image/jpg;base64,${result.base64}`});
                const response = await fetch(url, { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: body });
                const json = await response.json();
                if(json.status == 200) Alert.alert("Info", json.content);
                else Alert.alert("Error", json.content);
                this.setState({spinner:false, refreshing:false});
                this.loadReportList();
            }
        }
        else{
            Alert.alert("Error", `Max images limit reached.\nCan upload only ${this.state.maxImage} images.`);
        }
    }

    render(){
        return(
            <View style={{ flex:1, backgroundColor:"#fff" }}>
                <StatusBar barStyle="dark-content" backgroundColor="#fff" />
                {
                    this.state.spinner?
                        <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
                            <Text>{this.state.spinnerTitle}</Text>
                        </View>
                    :
                        this.state.reportList.length <= 0?
                            <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
                                {
                                    this.state.mode == "ADD"?
                                        <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
                                            <Text>Report Not Found Max Image: {this.state.maxImage}</Text>
                                            <Button containerStyle={{padding:5, margin:10}} type="outline" title="reload" onPress={this.loadReportList} icon={{ type:"material-community", name:"reload", size:14 }}/>
                                            <Text style={{marginTop:40, color:"#8a8a8a"}}>press long click in report image to remove</Text>
                                        </View>
                                    :
                                        <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
                                            <Text>Report Not Found.</Text>
                                            <Button containerStyle={{padding:5, margin:10}} type="outline" title="reload" onPress={this.loadReportList} icon={{ type:"material-community", name:"reload", size:14 }}/>
                                        </View>
                                }
                                
                            </View>
                        :
                            <FlatList
                                numColumns={2}
                                style={{flex: 1}}
                                data={this.state.reportList} 
                                renderItem={this.itemComponent}
                                keyExtractor={item => item.id.toString()}
                                refreshing={this.state.refreshing}
                                onRefresh={this.loadReportList}
                            />
                }
                {
                    this.state.mode == "ADD"?
                        !this.state.spinner?
                            <View style={{ position:"absolute", bottom:10, right:10 }}>
                                <Icon size={28} raised name='add-outline' type='ionicon' color='#3578e5' onPress={() => { this.openImagePicker() } } />
                            </View>
                        :
                            null
                    :
                        null
                }
                
            </View>
        );
    }
}