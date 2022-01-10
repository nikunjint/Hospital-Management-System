import React from 'react';
import { View, StatusBar, ScrollView } from 'react-native';
import { Text, Button, Input, Card } from 'react-native-elements';
import Utils  from '../modules/Utils';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Toast from 'react-native-simple-toast';

export default class PatientDonateBloodScreen extends React.Component{
    state = {
        spinnerTitle: "loading..",
        spinner: false,
        refreshing: false,

        id: "",
        name: "",
        email: "",
        sex: "",
        blood: "A+",
        phone: "",
        address: "",
        
        donationDate: new Date(Date.now()),
        donationVisible: false,
    }

    componentDidMount(){
        this.loadUserInfo();
    }

    loadUserInfo = async() => {
        try{
            this.setState({spinner: true, spinnerTitle: "loading info..", refreshing: true});
            const url = Utils.serverUrl() + "user-info?_id=" + global.id;
            const response = await fetch(url);
            const json = await response.json();
            if(json.status == 200){
                const data = json.content;
                this.setState({ id: data._id, dob:data.dob, address: data.address, blood: data.blood, email: data.email, name: data.fullname, sex: data.gender, phone: data.phone, photo: data.photo });
            }
            else Alert.alert("Error", json.content);
            this.setState({spinner:false, refreshing:false});
        }
        catch(error){
            console.error(error);
        }
    }

    addBloodFormInfo = async() => {
        try{
            if(this.state.name == "" || this.state.email == "" || this.state.sex == "" || this.state.blood == "" || this.state.phone == "" || this.state.address == "" || this.state.donationDate == ""){
                Toast.show("Please fill form completely!");
                return;
            }

            this.setState({spinner: true, spinnerTitle: "submitting form..", refreshing: true});
            const url = Utils.serverUrl() + "add-patient-blood-info?patientId=" + global.id + "&fullname=" + this.state.name + "&email=" + this.state.email + 
                        "&gender=" + this.state.sex + "&blood=" + this.state.blood + "&phone=" + this.state.phone + "&address=" + this.state.address + 
                        "&donationDate=" + this.state.donationDate;
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
                <DateTimePickerModal testID="donationDate" mode="date" isVisible={this.state.donationVisible} onConfirm={date => this.setState({donationDate:date, donationVisible:true})} onCancel={()=>{ this.setState({donationVisible:false}) }}/>
                {
                    this.state.refreshing?
                        <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
                            <Text>{this.state.spinnerTitle}</Text>
                        </View>
                    :
                        <ScrollView style={{ flex: 1, backgroundColor:"#fff", paddingBottom:20 }}>
                            <Card style={{flex:1, marginBottom:10}} containerStyle={{ marginBottom:10 }}>
                                <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5" }}>Full Name</Text>
                                <Input onChangeText={(v)=> this.setState({name:v})} value={this.state.name}/>
                                <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5" }}>Email</Text>
                                <Input onChangeText={(v)=> this.setState({email:v})} value={this.state.email} />
                                <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5" }}>Biological Gender</Text>
                                <Picker selectedValue={this.state.sex} style={{height:50}} onValueChange={(v,i)=>{ this.setState({sex:v}); }}>
                                    <Picker.Item label="Male" value="Male"/>
                                    <Picker.Item label="Fe-Male" value="Female"/>
                                </Picker>

                                <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5", marginTop:8 }}>Blood Group</Text>
                                <Picker selectedValue={this.state.blood} style={{height:50}} onValueChange={(v,i)=>{ this.setState({blood:v}); }}>
                                    <Picker.Item label="A" value="A"/>
                                    <Picker.Item label="A-" value="A-"/>
                                    <Picker.Item label="B" value="B"/>
                                    <Picker.Item label="B-" value="B-"/>
                                    <Picker.Item label="AB" value="AB"/>
                                    <Picker.Item label="AB-" value="AB-"/>
                                    <Picker.Item label="O" value="O"/>
                                    <Picker.Item label="O-" value="O-"/>
                                </Picker>
                                <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5", marginTop:8 }}>Phone No.</Text>
                                <Input onChangeText={(v)=> this.setState({phone:v})} value={this.state.phone} />

                                <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5" }}>Address</Text>
                                <Input onChangeText={(v)=> this.setState({address:v})} value={this.state.address} />

                                <Text style={{ marginLeft:10, fontSize:18, color:"#3578e5" }}>Assign Dontation Date</Text>
                                <Text style={{ fontSize:18, color:"#000", backgroundColor:"#e3e3e3", padding:8 }} onPress={() => this.setState({donationVisible:true})} >{this.state.donationDate.toLocaleDateString("en-US")}</Text>

                                <Button containerStyle={{marginTop:20}} title="Submit Form" onPress={() => this.addBloodFormInfo() } />
                            </Card>
                        </ScrollView>
                }
            </View>
        );
    }
}