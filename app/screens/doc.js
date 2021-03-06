import React, {Component} from 'react';
import { StyleSheet, View, ScrollView, FlatList, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import RNSecureKeyStore from 'react-native-secure-key-store';
import Schema from '../schemas.js';
const CryptoJS = require("crypto-js");
const base64js = require('base64-js');
const Realm = require('realm');

class Doc extends Component {
  constructor(props) {
    super(props);  
    this.state = {
      data: [],
    };   
    this.refreshFunction = this.refreshFunction.bind(this);  
    }    
  static navigationOptions = {
    title: 'All documents',
    headerTitleStyle: { color: '#26abe2',fontWeight: 'normal'}, 
    headerTintColor: '#26abe2'
  };
refreshFunction() {     
let key1 = "";
RNSecureKeyStore.get("key1")
	.then((res) => {
		key1 = res;
	}).then(() => {
   
   let key = base64js.toByteArray(key1);
  
       Realm.open({schema: Schema, encryptionKey: key})
  .then(realm => {

       this.setState({data: realm.objects('Doc')});    
    });    
});       
}
componentDidMount() {
this.refreshFunction();

}
renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          backgroundColor: "#CED0CE",
        }}
      />
    );
}
  render() {
    const { state, navigate } = this.props.navigation;
    return (
     <View style={{flex: 1, flexDirection: 'column', backgroundColor: 'white',}}> 
    <View style={{alignItems: 'center'}}>
    <Icon style={{marginTop: 10}} name="plus-circle" size={35} color="#26abe2" onPress={() => navigate("AddDoc", {refresh: this.refreshFunction})} />    
    </View>    
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}> 
    <FlatList
          ItemSeparatorComponent={this.renderSeparator}
          data={this.state.data}
          keyExtractor={item => item.id}
          renderItem={({ item }) => {
            return (
              <View style={{
          marginLeft: 10,
          marginTop: 5,         
          marginBottom: 5,        
        }}>
                <TouchableOpacity onPress={() => navigate("ShowDoc", {id: item.id, type: item.type, number: item.number, issue: item.issue_date, expiration: item.expiration_date, other: item.other_info, refresh: this.refreshFunction})} >
                <Text style={{fontSize: 20, color: "black"}}>{item.type}</Text>
                </TouchableOpacity> 
              </View>
            );
          }}
        />    
    </ScrollView>    
       
   </View>
    );
  }
};
export default Doc; 