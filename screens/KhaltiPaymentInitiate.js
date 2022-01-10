import React from 'react';
import { View, StatusBar, ScrollView, RefreshControl, Alert } from 'react-native';
import { Text, Image, Button, Input} from 'react-native-elements';
import Utils from '../modules/Utils';

export default class KhaltiPaymentInitiate extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            spinnerTitle: "loading..",
            spinner: false,
    
            mobile: "",
            pin: "",
            product_identity: props.route.params.product_identity,
            product_name: props.route.params.product_name,
            amount: props.route.params.amount,

            doctorId: props.route.params.doctorId,
            appointmentId: props.route.params.appointmentId,
            remarks: props.route.params.remarks,
            paymentMethod: props.route.params.paymentMethod
        }
    }

    processKhaltiPayment = async() => {
        try{
            this.setState({spinner:true, spinnerTitle:"processing..", refreshing:true});
            const url = Utils.khalti_payment_init;
            const body = { public_key: Utils.khalti_public_secret, mobile: this.state.mobile, transaction_pin: this.state.pin,  amount: parseFloat(this.state.amount) * 100, product_identity: this.state.product_identity, product_name: this.state.product_name };
            const response = await fetch(url, { method:"POST", headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body)});
            const json = await response.json();
            if(json.token != ""){
                const appointmentData = { doctorId:this.state.doctorId, appointmentId:this.state.appointmentId, remarks:this.state.remarks, paymentMethod:this.state.paymentMethod };
                this.props.navigation.replace("KhaltiPaymentConfirmation", { appointmentData:appointmentData, body:body, json: json });
            }
            else{
                Alert.alert("Error", "Mobile Number and Pin Number doesnot matched.");
                console.error(json);
            }
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
                    <ScrollView style={{ flex: 1, backgroundColor:"#fff" }}>
                        <View style={{ margin:10, padding:10, alignSelf:"stretch", marginBottom:20 }}>
                            <View style={{ flex:1, alignContent:"center", justifyContent:"center", flexDirection:"row", marginBottom:30 }}>
                                <Image source={require("../assets/icons/khalti_logo.png")} style={{ width:300, height:100 }}/>
                            </View>
                            <Text style={{ marginLeft:10, fontSize:14, color:"#3578e5" }}>Mobile Number</Text>
                            <Input style={{ marginLeft:10, marginBottom:10, fontSize:17, color:"#6e6e6e" }} value={this.state.mobile} onChangeText={(t) => this.setState({mobile:t})}/>
                            
                            <Text style={{ marginLeft:10, fontSize:14, color:"#3578e5" }}>Pin Number</Text>
                            <Input secureTextEntry style={{ marginLeft:10, marginBottom:10, fontSize:17, color:"#6e6e6e" }} value={this.state.pin} onChangeText={(t) => this.setState({pin:t})}/>

                            <Button title="Proceed" onPress={()=>{ this.processKhaltiPayment(); }} />
                        </View>
                    </ScrollView>
                }
            </View>
        );
    }
}