import React, {Component} from 'react';
import { StyleSheet, View, ScrollView, Alert, TextInput, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import RNSecureKeyStore from 'react-native-secure-key-store';
import Schema from '../schemas.js';
const CryptoJS = require("crypto-js");
const base64js = require('base64-js');
const Realm = require('realm');

class AddBank extends Component {
  constructor(props) {
    super(props);  
    this.state = {
      key: "",    
      id: "",    
      name: "",
      number: "",
      password: "",
      other: ""
    };  
    this.addData = this.addData.bind(this);
    }    
  static navigationOptions = {
    title: 'Add a bank',
    headerTitleStyle: { color: '#26abe2',fontWeight: 'normal'}, 
    headerTintColor: '#26abe2'
  };
componentDidMount () {
    
let key1 = "";
RNSecureKeyStore.get("key1")
	.then((res) => {
		key1 = res;
	}).then(() => {
   
   let key = base64js.toByteArray(key1);
   this.setState({key: key});  
       Realm.open({schema: Schema, encryptionKey: key})
  .then(realm => {

       let data = realm.objects('IdNumber');
       this.setState({id: data[0]["id_number"] + 1});    
    });    
});   
    
}
goback() {
this.props.navigation.state.params.refresh();    
this.props.navigation.navigate('Bank');    
}
addData() {
    if (this.state.name != "") {
    Realm.open({schema: Schema, encryptionKey: this.state.key })
  .then(realm => {
    realm.write(() => {
      realm.create('Bank', {
        id: this.state.id,  
        bank_name: this.state.name,
        account_number: this.state.number,
        password: this.state.password,
        other_info: this.state.other,
      });
    realm.create('IdNumber', {
        id: 0,
        id_number: this.state.id
      }, true);   
    })}).then(() => {
          Alert.alert(
  '',
  'Data added successfully.',
  [
    {text: 'OK', onPress: () => this.goback()},
  ],
  { cancelable: false }
);
      });  
    } else {
     Alert.alert(
  '',
  'The bank name field is required!',
  [
    {text: 'OK', onPress: () => console.log('required field')},
  ],
  { cancelable: false }
);   
    }
}
  render() {
    const { state, navigate } = this.props.navigation;
    return (
     <View style={{backgroundColor: 'white', height: "100%", justifyContent: 'center', alignItems: 'center',}}> 
    <TextInput placeholder="Bank name"  style={styles.textField} onChangeText={(name) => this.setState({name})} value={this.state.name} />
    <TextInput placeholder="Account number" style={styles.textField} onChangeText={(number) => this.setState({number})} value={this.state.number} />
    <TextInput placeholder="Password" style={styles.textField} onChangeText={(password) => this.setState({password})} value={this.state.password} />
    <TextInput placeholder="Other info" style={styles.textField} onChangeText={(other) => this.setState({other})} value={this.state.other} />
    <TouchableOpacity style={styles.button} onPress={this.addData}>
    <Text style={{ color: '#26abe2', fontWeight: 'bold', fontSize: 18, textAlign: 'center', marginTop: 7 }}>Save</Text>
</TouchableOpacity>    
   </View>

    );
  }
};
export default AddBank; 

const styles = StyleSheet.create({ 
textField: {
 borderRadius: 10,    
 width: '80%',       
  },
button: {
 borderColor: '#26abe2',    
 width: '80%', 
 height: 40,  
 alignContent: 'center',  
 backgroundColor: 'transparent', 
 borderWidth: 1,  
 borderRadius: 4,
 marginTop: 10,  
  },    
});