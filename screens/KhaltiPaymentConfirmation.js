import React from 'react';
import { View, StatusBar, ScrollView, RefreshControl, Alert } from 'react-native';
import { Text, Image, Button, Input} from 'react-native-elements';
import Utils from '../modules/Utils';

export default class KhaltiPaymentConfirmation extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            spinnerTitle: "loading..",
            spinner: false,
    
            appointmentData: props.route.params.appointmentData,
            body: props.route.params.body,
            json: props.route.params.json,
            code: ""
        }
    }

    confirmKhaltiPayment = async() => {
        try{
            if(this.state.code == ""){ Alert.alert("Error", "Please enter confirmation code."); return;}

            this.setState({spinner:true, spinnerTitle:"confirming transaction..", refreshing:true});
            const url = Utils.khalti_payment_confirm;
            const body = { public_key: Utils.khalti_public_secret, token: this.state.json.token, confirmation_code: this.state.code,  transaction_pin: this.state.body.transaction_pin};
            const response = await fetch(url, { method:"POST", headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body)});
            const json = await response.json();
            if(json.amount == this.state.body.amount){ 
                this.setState({spinner:true, spinnerTitle:"making appointment please wait..", refreshing:true});
                const url_m_a = Utils.serverUrl() + "make-appointment";
                const body_m_a = { patientId: global.id, doctorId: this.state.appointmentData.doctorId, appointmentId: this.state.appointmentData.appointmentId, paymentMethod: this.state.appointmentData.paymentMethod, transactionData: JSON.stringify(json), remarks: this.state.appointmentData.remarks, charge: this.state.body.amount };
                const response_m_a = await fetch(url_m_a, { method:"POST", headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body_m_a)});
                const json_m_a = await response_m_a.json();
                if(json_m_a.status == 200){
                    this.props.navigation.popToTop();
                    Alert.alert("Info", "Appointment Booking complete.");
                }
                else Alert.alert("Error", "Something wrong in server");
            }
            else{ Alert.alert("Error", "Confirmation Code Error."); console.error(json); }
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
                    this.state.refreshing?
                        <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
                            <Text>{this.state.spinnerTitle}</Text>
                        </View>
                    :
                    <ScrollView refreshControl={ <RefreshControl refreshing={this.state.refreshing} onRefresh={this.loadPatientInfo}/> } style={{ flex: 1, backgroundColor:"#fff" }}>
                        <View style={{ margin:10, padding:10, alignSelf:"stretch", marginBottom:20 }}>
                            <View style={{ flex:1, alignContent:"center", justifyContent:"center", flexDirection:"row", marginBottom:30 }}>
                                <Image source={require("../assets/icons/khalti_logo.png")} style={{ width:300, height:100 }}/>
                            </View>
                            <Text style={{ marginLeft:10, fontSize:14, color:"#3578e5" }}>Confirm Code</Text>
                            <Input secureTextEntry style={{ marginLeft:10, marginBottom:10, fontSize:17, color:"#6e6e6e" }} value={this.state.code} onChangeText={(t) => this.setState({code:t})}/>

                            <Button title="Confirm" onPress={()=>{ this.confirmKhaltiPayment(); }} />
                        </View>
                    </ScrollView>
                }
            </View>
        );
    }
}