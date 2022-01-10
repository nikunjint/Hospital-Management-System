import React from 'react';
import { View, StatusBar, ScrollView } from 'react-native';
import { Text, Button, Card } from 'react-native-elements';
import Utils  from '../modules/Utils';
import Toast from 'react-native-simple-toast';
import { Picker } from '@react-native-picker/picker';

export default class PatientBookBedScreen extends React.Component{
    state = {
        spinnerTitle: "loading..",
        spinner: false,
        refreshing:false,

        bed_id: "",
        bed_title: "",
        bed_total: "",
        bed_rate: "",
        bed_created: "",
        paymentMethod: "",
        available: 0
    }

    componentDidMount(){
        if(this.props.route.params.id){ this.setState({bed_id: this.props.route.params.id }); }
        if(this.props.route.params.title){ this.setState({bed_title: this.props.route.params.title }); }
        if(this.props.route.params.total){ this.setState({bed_total: this.props.route.params.total }); }
        if(this.props.route.params.rate){ this.setState({bed_rate: this.props.route.params.rate }); }
        if(this.props.route.params.created_at){ this.setState({bed_created: this.props.route.params.created_at }); }
        if(this.props.route.params.available){ this.setState({available: this.props.route.params.available }); }
    }

    reserved = async() => {
        try{
            if(this.state.available <=0){ Toast.show("No bed available please try again later."); return; }
            if(this.state.paymentMethod == ""){ Toast.show("Please select payment method."); return; }

            this.setState({refreshing:true, spinner:true, spinnerTitle: "reserving bed.."});
            const url = Utils.serverUrl() + "bed-reserved-patient?bedId=" + this.state.bed_id + "&patientId=" + global.id + "&rate=" + this.state.bed_rate + "&paymentMethod=" + this.state.paymentMethod;
            const response = await fetch(url);
            const json = await response.json();
            if(json.status == 200){
                Toast.show(json.content);
                this.props.navigation.pop();
            }
            else Alert.alert("Error", json.content);
            this.setState({spinner:false, refreshing:false});
        }
        catch(error){
            console.error(error);
        }
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
                        <ScrollView style={{ flex: 1, backgroundColor:"#fff" }}>
                            <Card style={{ margin:10, padding:10, alignSelf:"stretch", marginBottom:20 }}>
                                <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5" }}>Bed Id</Text>
                                <Text style={{ marginLeft:10, marginBottom:10, fontSize:17, color:"#6e6e6e" }}>{ this.state.bed_id }</Text>
                                <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5" }}>Bed Title</Text>
                                <Text style={{ marginLeft:10, marginBottom:10, fontSize:17, color:"#6e6e6e" }}>{ this.state.bed_title }</Text>
                                <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5" }}>Bed Rate</Text>
                                <Text style={{ marginLeft:10, marginBottom:10, fontSize:17, color:"#6e6e6e" }}>Rs.{ this.state.bed_rate }/-</Text>

                                <Picker selectedValue={this.state.paymentMethod} style={{height:50}} onValueChange={(v,i)=>{ this.setState({paymentMethod:v}); }}>
                                    <Picker.Item label="Select Payment Method" value=""/>
                                    <Picker.Item label="ESEWA" value="ESEWA"/>
                                </Picker>
                                
                                <Button containerStyle={{marginTop:20}} title="Reserve Bed" onPress={() => this.reserved()} />
                            </Card>
                        </ScrollView>
                }
            </View>
        );
    }
}