import React from 'react';
import { View, Image, StatusBar } from 'react-native';
import { Text, Icon} from 'react-native-elements';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';
import { Alert } from 'react-native';
import Utils from '../modules/Utils';

export default class BedMakerScreen extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            spinnerTitle: "loading..",
            spinner: false,
            photo: props.route.params.photo
        }
    }

    saveImage = async() => {
        const permission = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
        if(permission.status != Permissions.PermissionStatus.GRANTED){ return; }
        try{
            this.setState({spinner:true, spinnerTitle: "saving image.."});
            const fileName = `REPORT_${Utils.random(11111111, 99999999)}.jpg`
            const uri = FileSystem.cacheDirectory + fileName;
            const base64Code = this.state.photo.split("data:image/jpg;base64,")[1];
            await FileSystem.writeAsStringAsync(uri, base64Code, { encoding:FileSystem.EncodingType.Base64 });
            await MediaLibrary.saveToLibraryAsync(uri);
            Alert.alert("Info", "File saved in Library");
            this.setState({spinner:false});
        }
        catch(e){
            this.setState({spinner:false});
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
                        <View style={{ flex:1, justifyContent:"center", alignItems:"center"}}>
                            <Image resizeMode="contain" source={{ uri: this.state.photo }} style={{ width:"100%", height:"100%", backgroundColor:"#fff" }}/>
                        </View>
                }
                <View style={{ position:"absolute", bottom:10, right:10 }}>
                    <Icon size={28} raised name='save' type='ionicon' color='#3578e5' onPress={() => { this.saveImage() } } />
                </View>
            </View>
        );
    }
}