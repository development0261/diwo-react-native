import React, {Component} from 'react';  
import {Dimensions, StyleSheet, Text, View,TouchableOpacity ,Image, Alert, ScrollView,FlatList,Keyboard, TextInput} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import { Dialog } from 'react-native-simple-dialogs';
import Text_EN from '../res/lang/static_text';
import {NavigationEvents} from 'react-navigation';
  
export default class home extends Component{
    myInterval="";
    constructor(props){
        super(props)
        this._retrieveData = this._retrieveData.bind(this);
        this.state = {
            tokenValue:"",
            token:"",
            firstName:"",
            dataSource:"",
            count:0,
            experienceText:"",
            answerSend:false,
            error_popup:false,
            isKeyboardOpen:0,
        }
        this._retrieveData();        
        this.page_reloaded = this.page_reloaded.bind(this);
    }
    page_reloaded(){
        this._retrieveData();
    }
    _retrieveData = async () => {
        try {
          const value = await AsyncStorage.getItem('visited_onces');
          if (value !== null ) {
            this.setState({token:JSON.parse(value),count:1});
            this.componentDidMount();
          }
        } catch (error) {          
          alert(error);
        }        
    };
    
    learnMore = () => {
        Linking.openURL('http://diwo.nu');
    }

    help_workjoy = () => {
        Alert.alert(
            'Hvad er arbejdsglæde?',
            Text_EN.Text_en.workjoy_help_popup,
            [              
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {text: 'Learn More', onPress: () => this.learnMore()},
            ],
            {cancelable: false},
        );
    }

    help_socialkapital = () => {
        Alert.alert(
            'Hvad er social Kapital?',
            Text_EN.Text_en.socialkapital_help_popup,
            [              
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {text: 'Learn More', onPress: () => this.learnMore()},
            ],
            {cancelable: false},
        );
    }

    help_experience = () => {
        Alert.alert(
            'Hvorfor skal jeg svareliht?',
            Text_EN.Text_en.experience_help_popup,
            [              
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {text: 'Learn More', onPress: () => this.learnMore()},
            ],
            {cancelable: false},
        );
    }

    send_experience = () =>{
      if(this.state.experienceText){
        var dt = new Date().getDate(); //Current Date
        var month = new Date().getMonth() + 1; //Current Month
        var year = new Date().getFullYear(); //Current Year
        var date = "";
        if(date<10){
          date = '0' + dt;
        }else{
          date = dt;
        }
        var reviewDate = year + '-' + month + '-' + date;        
        
        const user_details = this.state.token;
        var headers = new Headers();
        let auth ='Bearer '+user_details.token;
        headers.append("Authorization",auth);

        var data = new FormData()
        data.append('user_id', this.state.userId);
        data.append('experience',this.state.experienceText);
        data.append('date',reviewDate);
        data.append('total_likes',0);
        console.log(data);
        fetch("http://diwo.nu/public/api/addExperience", {
            method: 'POST',
            headers: headers,
            body:  data,
        })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
            if(responseJson.status==200){
                console.log(responseJson);
                this.setState({answerSend:true,experienceText:""});
            }else{
                alert("Something went wrong.");
            }
        }).catch((error) =>{
            console.error(error);
        });
      }else{
        this.setState({error_popup:true});
      }
    }

    _keyboardDidShow = () => {
      this.setState({isKeyboardOpen:1});
    } 

    _keyboardDidHide = () => {
      this.setState({isKeyboardOpen:0});
    }

    componentWillUnmount () {
      this.keyboardDidShowListener.remove();
      this.keyboardDidHideListener.remove();
    }

    componentDidMount(){
        const { navigation  } = this.props;
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
        if(this.state.count==1){
            const user_details = this.state.token;
            // this.setState({token:userToken.token});
            var headers = new Headers();
            let auth ='Bearer '+user_details.token;
            headers.append("Authorization",auth);
            fetch("http://diwo.nu/public/api/user", {
                method: 'POST',        
                headers: headers,
            })
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson){
                    this.setState({firstName:responseJson.user.first_name,userId:responseJson.user.user_id});
                }
            }).catch((error) =>{
                console.error(error);
            });

            fetch("http://diwo.nu/public/api/user", {
            method: 'POST',        
            headers: headers,
          })
          .then((response) => response.json())
          .then((responseJson) => {
            if(responseJson){
              this.setState({firstName:responseJson.user.first_name,userId:responseJson.user.user_id});
            }
          }).catch((error) =>{
            console.error(error);
          });

          fetch("http://diwo.nu/public/api/authenticatedUserExperience", {
            method: 'POST',
            headers: headers,
          })
          .then((response) => response.json())
          .then((responseJson) => {
            console.log(responseJson);
            this.setState({dataSource:responseJson.experience});
          }).catch((error) =>{
            console.error(error);
          });
        }
    }

    render() {
        var {height, width} = Dimensions.get('window');
        return (
        <View style={styles.container}>
          <Dialog
            visible={this.state.answerSend}
            onTouchOutside={() => this.setState({answerSend: false})} >
            <View style={{position:'relative'}}>
                <View style={styles.dialog_close_icon}>
                    <TouchableOpacity onPress={()=>this.setState({answerSend: false})}>
                      <Image
                        style={{width:width * 0.08, height:width * 0.08}}
                        source={require('../../uploads/close.png')}
                      />
                    </TouchableOpacity>
                </View>
                <View style={{paddingBottom:10}}>
                  <Text style={styles.dialog_txt}>{Text_EN.Text_en.experience_pop}</Text>
                </View>
            </View>
          </Dialog>
          <Dialog
            visible={this.state.error_popup}
            onTouchOutside={() => this.setState({error_popup: false})} >
            <View style={{position:'relative'}}>
                <View style={styles.dialog_close_icon}>
                    <TouchableOpacity onPress={()=>this.setState({error_popup: false})}>
                      <Image
                        style={{width:width * 0.08, height:width * 0.08}}
                        source={require('../../uploads/close.png')}
                      />
                    </TouchableOpacity>
                </View>
                <View style={{paddingBottom:10,width:'85%'}}>
                  <Text style={styles.dialog_txt}>{Text_EN.Text_en.experience_error_pop}</Text>
                </View>
            </View>
          </Dialog>
          <NavigationEvents onDidFocus={() => {this.page_reloaded()}} />
          <Image
            style={styles.background_diamond}
            source={require('../../uploads/diamond-dark.png')}
          />
          <View style={{padding:10,flexDirection:'row',borderBottomColor:'#01a2ff',borderBottomWidth:2}}>
            <View style={{flex:0.5}}>
              <Text style={{fontSize:18}}>Hej <Text style={{fontWeight:"bold",fontSize:18}}>{this.state.firstName}</Text></Text>
            </View>
            <View style={{flex:0.7}}>
              <Image
                style={{width:80, height:30}}
                source={require('../../uploads/Diwologo_png.png')}
              />
            </View>
            <View style={{flex:0.15,justifyContent:'flex-end',alignSelf:'flex-end'}}>
                <TouchableOpacity onPress={()=>this.props.navigation.toggleDrawer()}>
                <Image
                  style={{width:35, height:30}}
                  source={require('../../uploads/drawer_menu.png')}
                />
                </TouchableOpacity>
            </View>
          </View>
          <View style={{flex:1,marginTop:10}}>
          <TouchableOpacity onPress={()=>this.props.navigation.navigate('More_info',{Firstname:this.state.firstName,token:this.state.token})}>
            <View style={{flexDirection:'row',justifyContent:'center',alignContent:'center',alignItems:'center'}}>
                <Text style={styles.upper_txt}>{Text_EN.Text_en.cooperation}</Text>
                <Image
                  style={styles.diamond_icon}
                  source={require('../../uploads/diamond_img.png')}
                />
                <Text style={styles.upper_txt}>{Text_EN.Text_en.trust}</Text>
                <Image
                  style={styles.diamond_icon}
                  source={require('../../uploads/diamond_img.png')}
                />
                <Text style={styles.upper_txt}>{Text_EN.Text_en.justice}</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.text_view}>
              <HideWithKeyboard>
                <Text style={styles.experience_title}>{Text_EN.Text_en.experience_title}</Text>
                <Text style={styles.experience_text}>{Text_EN.Text_en.experience_text}</Text>
              </HideWithKeyboard>
              <TextInput
                style={styles.Text_input}
                placeholder={Text_EN.Text_en.experience_placeholder}
                multiline={true}
                numberOfLines={8}
                onChangeText={(experienceText) => this.setState({experienceText})}
              />
              <Text style={{textAlign:'center'}}>{Text_EN.Text_en.experience_note}</Text>
              <TouchableOpacity style={styles.active_submit_btn} onPress={()=>this.send_experience()}>
                <Text style={styles.submit_btn}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{flex:0.4}}>
            <View style={styles.text_view}>
              <Text style={styles.experience_likes}>Delte oplevelser</Text>            
              <FlatList
                style={{padding:5}}
                data={this.state.dataSource}
                showsVerticleScrollIndicator={false}
                renderItem={({item}) =><View style={styles.dynamic_list_view}>
                    <Text style={styles.list_part1}>
                        {item.date}
                    </Text>
                    <View  style={styles.list_part2}>
                      <Text style={{fontSize:width * 0.045}}>
                          {item.total_likes}                      
                      </Text>
                      <Image
                        style={styles.like_icon}
                        source={require('../../uploads/like_color.png')}
                      />
                    </View>
                </View>}
                keyExtractor={({id}, index) => id}
              />
            </View>
          </View>
          {/* {this.state.isKeyboardOpen==0 ?
          <View style={{flex:0.2,flexDirection:'row',marginLeft:12,marginRight:12}}>
            <HideWithKeyboard></HideWithKeyboard>
            <View style={styles.bottom_btn}>
              <TouchableOpacity onPress={()=>this.help_workjoy()}>
                <Text style={styles.bottom_btn_txt}>{Text_EN.Text_en.bottom_btn_one_txt}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.bottom_btn}>
              <TouchableOpacity onPress={()=>this.help_socialkapital()}>
                <Text style={styles.bottom_btn_txt}>{Text_EN.Text_en.bottom_btn_two_txt}</Text>                        
              </TouchableOpacity>
            </View>
            <View style={styles.bottom_btn}>
              <TouchableOpacity onPress={()=>this.help_experience()}>
                <Text style={styles.bottom_btn_txt}>{Text_EN.Text_en.bottom_btn_three_txt}</Text>
              </TouchableOpacity>
            </View>
          </View>:null} */}
        </View>
        );  
    }
}  
const {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({  
  container: {  
    flex: 1,
    position:'relative'
  },
  active_submit_btn:{
    marginTop:width * 0.04,
    marginRight:width * 0.04,
    paddingTop:width * 0.03,
    paddingBottom:width * 0.03,
    paddingLeft:width * 0.11,
    paddingRight:width * 0.11,
    justifyContent:'flex-end',
    alignSelf:'flex-end',
    backgroundColor:'#00a1ff',
    borderRadius:10
  },
  bottom_btn:{
    width:'30.333%',
    backgroundColor:'#00a1ff',
    marginTop:0,
    marginLeft:8,
    marginBottom:2,
    borderRadius:10,
    justifyContent:'center'
  },
  bottom_btn_txt:{
    textAlign:'center',
    color:'white',
    fontSize:width*0.042,
    padding:10
  },
  submit_btn:{
    textAlign:'center',
    color:'white',
    fontSize:width * 0.045,
    fontWeight:'bold'
  },
  background_diamond:{
    position:'absolute',
    width:width*1,
    height:width*0.90,
    bottom:-width*0.3,
    right:-width*0.28,
    opacity:0.2,
    transform: [{ rotate: "321deg" }] 
  },
  diamond_icon:{
    width:width * 0.08,
    height:width * 0.08,
    marginLeft:10,
    marginRight:10
  },
  upper_txt:{
    fontSize: width * 0.045,
    color:'#038fc1',
    fontWeight:'bold'
  },
  experience_title:{
    textAlign:'center',
    fontWeight:'bold',
    fontSize:width * 0.045,
    
  },
  experience_text:{
    textAlign:'center',
    marginRight:width * 0.097,
    marginLeft:width * 0.097,
    fontSize:width * 0.045,
    lineHeight:25
  },
  text_view:{
    marginTop:15
  },
  Text_input:{
    paddingLeft:15,
    borderWidth: 1,
    textAlignVertical: "top",
    backgroundColor:"white",
    borderTopColor:'black',
    borderLeftColor:'black',
    borderBottomColor:'black',
    borderRightColor:'black',
    margin:30,
    marginBottom:0,
    borderRadius:15,
  },
  dialog_close_icon:{
    paddingBottom:10,
    justifyContent:'flex-end',
    alignItems:'flex-end',
    position:'absolute',
    top:0,
    right:-5, 
  },
  dialog_txt:{
    fontWeight: "500",
    color:"black",
    fontSize:width*0.038,
  },
  dynamic_list_view:{
    flexDirection:'row',
    marginBottom:15,
  },
  like_icon:{
    width:width * 0.06,
    height:width * 0.06,
    marginLeft:10,
    marginRight:10
  },
  experience_likes:{
    fontWeight:'bold',
    color:'black',
    fontSize:width * 0.05,
    padding:5,
  },
  list_part1:{
    flex:0.8,
    fontSize:width * 0.045    
  },
  list_part2:{
    justifyContent:'center',
    flex:0.2,
    flexDirection:'row'
  },
});  