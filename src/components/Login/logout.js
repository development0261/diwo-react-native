import React, {Component} from 'react';  
import {StyleSheet, Text, View,TouchableOpacity,Image,KeyboardAvoidingView,TextInput, ActivityIndicator} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';
import {NavigationEvents} from 'react-navigation';
  
export default class logout extends Component{  
    constructor(props){
        super(props)
        this.state = {
            username:"",
            password:"",
            token:"",
        }
    }

    page_reloaded = () => {
      this.logout();
    }

    logout = async () =>{
        try {
            const value = await AsyncStorage.removeItem('visited_onces');
            this.props.navigation.navigate('Login');
            console.log(value);
            }catch (error) {          
            alert(error);
        }
    };

    componentDidMount(){
        console.log("Logout page");
        this.logout();
    }
    

  render() {  
    return (
        <View style={styles.container}>
          <NavigationEvents onDidFocus={() => {this.page_reloaded()}} />
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
    );  
  }  
}  
  
const styles = StyleSheet.create({  
  container: {
    flex:1,
    justifyContent:'center',
  },  
});  