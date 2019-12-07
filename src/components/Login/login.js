import React, {Component} from 'react';  
import {StyleSheet, Text, View,TouchableOpacity,Image,KeyboardAvoidingView,TextInput,Dimensions,ActivityIndicator,Linking} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import { BackHandler } from 'react-native';
import { withNavigationFocus } from 'react-navigation';
import Text_EN from '../res/lang/static_text';
  
export default class login extends Component{  
    constructor(props){
        super(props)
        //this._retrieveData = this._retrieveData.bind(this);
        this.state = {
            username:"",
            password:"",
            token:"",
            loading:true
        }
        //this._retrieveData();
        this.login_clicked = this.login_clicked.bind(this);
        this.storeData = this.storeData.bind(this);
        // this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    // _retrieveData = async () => {
    //   try {
    //     const value = await AsyncStorage.getItem('visited_onces');
    //     if (value !== null ) {
    //       this.setState({loading:false});
    //       this.props.navigation.navigate('Home',{Json_value:value});
    //       console.log(value);
    //     }
    //   } catch (error) {          
    //     alert(error);
    //   }        
    // };

    storeData = async () => {
      let obj = {
        token:this.state.token,
      }
      try {
        await AsyncStorage.setItem('visited_onces', JSON.stringify(obj));
      } catch (e) {
        alert(e);
      }
    }

    login_clicked(){
      var username = this.state.username;
      var password = this.state.password;
      //alert(username);
      var data = new FormData()
      data.append('email', username);
      data.append('password', password);      
      console.log(data);
      fetch("http://diwo.nu/public/api/login", {
        method: 'POST',        
        body:  data
      })
      .then((response) => response.json())
      .then((responseJson) => {
        if(responseJson.status==200){
          //console.log(responseJson.token);
          this.setState({token:responseJson.token});
          this.storeData();
          this.props.navigation.navigate('Home',{token:responseJson.token});
        }else{
          alert("Invalid Credentails");
        }
      }).catch((error) =>{
        console.error(error);
      });
    }

    // UNSAFE_componentWillMount() {
    //   BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    // }
    
    // UNSAFE_componentWillUnmount() {
    //     BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    // }

    // handleBackButtonClick() {
    //   console.log(this.props.navigation.isFocused());
    //   if(this.props.navigation.isFocused()){
    //     BackHandler.exitApp();
    //     return true;
    //   }
    // }

    componentDidMount(){
      this.setState({loading:false});
    }

  render() {
    var {height, width} = Dimensions.get('window');
    const { navigate } = this.props.navigation;
    console.log(width);
    // console.log(height);
    return (
          <KeyboardAvoidingView style={styles.container} behavior="height">
          {this.state.loading==true?<View style={styles.spinner} pointerEvents={'none'} >
              <ActivityIndicator size="large" color="#00a1ff" animating={this.state.loading}/>
          </View>:null}
          <View style={styles.container}>          
            <Image
                style={{position:'absolute',width:width*1, height:width*0.90,bottom:-width*0.3,right:-width*0.28,opacity:0.1,transform: [{ rotate: "321deg" }] }}
                source={require('../../uploads/diamond.png')}
            />
          <View style={styles.first_container}>
            <Image
                style={{width:width*0.8, height: width*0.33}}
                source={require('../../uploads/Diwo_logo_txt.png')}
            />
          </View>
          <View style={styles.second_container}>
              <View style={{position:'relative'}}>
                <Text style={{position:'absolute',left:width*0.16,backgroundColor:'white',zIndex:999,top:-10}}> {Text_EN.Text_en.email} </Text>                    
                <TextInput
                    style = {styles.input}
                    autoCapitalize = "none"
                    returnKeyType="next"
                    returnKeyLabel="Next"
                    paddingLeft={15}
                    onChangeText = {(username) => this.setState({username})}
                />
              </View>
              <View style={{position:'relative'}}>
                  <Text style={{position:'absolute',left:width*0.16,backgroundColor:'white',zIndex:999,top:-10}}> {Text_EN.Text_en.password} </Text>
                  <TextInput
                      style = {styles.input}
                      autoCapitalize = "none"
                      returnKeyLabel="Go"
                      secureTextEntry={true}
                      paddingLeft={15}
                      onChangeText = {(password) => this.setState({password})}
                  />                  
                  <Text style={{textAlign:'right',marginRight:width*0.11}}>{Text_EN.Text_en.forget_password}</Text>
              </View>
              <View>
                  <TouchableOpacity onPress={()=>this.login_clicked()}>
                      <LinearGradient colors={['#87d9f7', '#00a1ff']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.log_btn}>
                          <Text style={{textAlign:'center',color:'white',fontSize:18,fontWeight:'bold'}}>Log in</Text>
                      </LinearGradient>
                  </TouchableOpacity>
              </View>
          </View>
          <HideWithKeyboard>
          <View style={{paddingBottom:10}}>
              <Text style={{textAlign:'center'}}>{Text_EN.Text_en.register} <Text style={{color:'#01a2ff',textDecorationLine: 'underline'}} onPress={() => Linking.openURL('http://diwo.nu/')}>{Text_EN.Text_en.click_here}</Text></Text>
          </View>
          </HideWithKeyboard>
      </View>
      </KeyboardAvoidingView>
    );  
  }  
}  
  
const styles = StyleSheet.create({  
  container: {
    flex:1,
    position:'relative',
  },
  first_container:{
    flex:0.4,
    justifyContent:'center',
    alignItems:'center',
    paddingTop:50
  },
  second_container:{
    flex:0.6,
    marginTop:40,
  },
  input: {
    marginBottom: 25,
    borderRadius:15,
    borderColor: '#01a2ff',
    borderWidth: 1.2,
    width:'80%',
    justifyContent:'center',
    alignSelf:'center',
    padding:15
  },
  log_btn:{
    marginTop:15,
    paddingTop:15,
    paddingBottom:15,
    paddingLeft:65,
    paddingRight:65,
    borderRadius:30,
    width:'50%',
    justifyContent:'center',
    alignSelf:'center'
  },
  spinner: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    zIndex:99999,
    backgroundColor:'grey',
    opacity:0.8
  },
}); 
