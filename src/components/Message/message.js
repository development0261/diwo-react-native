import React, {Component} from 'react';  
import {Dimensions, StyleSheet, Text, View,TouchableOpacity ,Image, Alert, TextInput, FlatList} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Dialog } from 'react-native-simple-dialogs';
import Text_EN from '../res/lang/static_text';
import {NavigationEvents} from 'react-navigation';
import MultiSelect from 'react-native-multiple-select';
  
export default class home extends Component{
    myInterval="";
    Newitem = [];
    constructor(props){
        super(props)
        this._retrieveData = this._retrieveData.bind(this);
        this.state = {
            tokenValue:"",
            token:"",
            firstName:"",
            dataSource:"",
            messageData:"",
            count:0,
            experienceText:"",
            answerSend:false,
            error_popup:false,
            isKeyboardOpen:0,
            message_dialog:false,
            message_title:"",
            message_text:"",
            title:"",
            message:"",
            selectedItems : [],
            errorText:""
        }
        this._retrieveData();
        this.page_reloaded = this.page_reloaded.bind(this);
    }
    onSelectedItemsChange = selectedItems => {
      this.setState({ selectedItems ,errorText:false});
    };
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

    messageDeleteConfirm = (messageID) =>{
      Alert.alert(
        'Er du sikker på, at du vil slette?',
        Text_EN.Text_en.delete_message,
        [              
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'Delete', onPress: () => this.messageDelete(messageID)},
        ],
        {cancelable: false},
      );
    }

    messageDelete = (messageID) =>{
      console.log(messageID);
      const user_details = this.state.token;
      var headers = new Headers();
      let auth ='Bearer '+user_details.token;
      headers.append("Authorization",auth);

      var data = new FormData()
      data.append('message_id', messageID);

      fetch("http://diwo.nu/public/api/deleteSingleMessage", {
        method: 'POST',        
        headers: headers,
        body:  data,
      })
      .then((response) => response.json())
      .then((responseJson) => {
        if(responseJson.status == 200){
          console.log(responseJson);
          this.componentDidMount();
        }else{
          alert("Something went wrong");
        }
      }).catch((error) =>{
        console.error(error);
      });
    }

    messageForward = (messageID) =>{
      console.log(messageID);
      const user_details = this.state.token;
      var headers = new Headers();
      let auth ='Bearer '+user_details.token;
      headers.append("Authorization",auth);

      var data = new FormData()
      data.append('message_id', messageID);

      fetch("http://diwo.nu/public/api/getSingleMessage", {
        method: 'POST',        
        headers: headers,
        body:  data,
      })
      .then((response) => response.json())
      .then((responseJson) => {
        if(responseJson.status == 200){
          console.log(responseJson);
          this.setState({message_title:responseJson.message_details.title,message_text:responseJson.message_details.message,message_dialog:true});
        }else{
          alert("Something went wrong");
        }
      }).catch((error) =>{
        console.error(error);
      });
    }

    message_send = () =>{
      console.log(this.state.message_title);
      console.log(this.state.message_text);
      console.log(this.state.selectedItems.toString());
      let rec_id = this.state.selectedItems.toString();
      if(rec_id.length > 0 && this.state.message_title.length > 0 && this.state.message_text.length > 0){
        const user_details = this.state.token;
        var headers = new Headers();
        let auth ='Bearer '+user_details.token;
        headers.append("Authorization",auth);
  
        var data = new FormData()
        data.append('receiver_id', rec_id);
        data.append('title',this.state.message_title);
        data.append('message',this.state.message_text);
        console.log(data);
        fetch("http://diwo.nu/public/api/sendMessage", {
            method: 'POST',
            headers: headers,
            body:  data,
        })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
            if(responseJson.status==200){
                console.log(responseJson);
                this.setState({message_dialog:false,title:"",message_text:"",selectedItems:[]});
            }else{
                alert("Something went wrong.");
            }
        }).catch((error) =>{
            console.error(error);
        });
      }else{
        this.setState({errorText:true});
      }
    }


    componentDidMount(){
        const { navigation  } = this.props;
        this.Newitem = [];
        console.log("page loaded");
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

          fetch("http://diwo.nu/public/api/userMessages", {
            method: 'POST',
            headers: headers,
          })
          .then((response) => response.json())
          .then((responseJson) => {
            console.log(responseJson);
            if(responseJson.status == 200){
              this.setState({messageData:responseJson.messages_array});
            }
          }).catch((error) =>{
            console.error(error);
          });

          fetch("http://diwo.nu/public/api/getAllUserInfo", {
            method: 'POST',
            headers: headers,
          })
          .then((response) => response.json())
          .then((responseJson) => {
              console.log(responseJson);
              //this.setState({item:responseJson.users[0].user_id});
              for(var i=0;i<responseJson.users.length;i++){
                  var id = responseJson.users[i].user_id;
                  var name = responseJson.users[i].first_name + ' ' + responseJson.users[i].last_name
                  console.log(id);
                  this.Newitem.push({
                    id:id,
                    name:name
                  });
              }
          }).catch((error) =>{
              console.error(error);
          });
        }
    }

    render() {
      const { selectedItems } = this.state;
      var {height, width} = Dimensions.get('window');
      return (
      <View style={styles.container}>         
        <NavigationEvents onDidFocus={() => {this.page_reloaded()}} />
        <Dialog
          visible={this.state.message_dialog}
          onTouchOutside={() => this.setState({message_dialog: false,errorText:false})} >
          <View style={{position:'relative'}}>
            <View style={styles.dialog_close_icon}>
              <TouchableOpacity onPress={()=>this.setState({message_dialog: false,errorText:false})}>
                <Image
                  style={{width:width * 0.08, height:width * 0.08}}
                  source={require('../../uploads/close.png')}
                />
              </TouchableOpacity>
            </View>
            <View style={{paddingBottom:10,marginTop:50}}>
              {this.state.errorText==true?<Text style={{paddingLeft:15,color:'red'}}>{Text_EN.Text_en.select_user_error}</Text>:null}
              <MultiSelect
                styleTextDropdown={{paddingLeft:15}}
                styleTextDropdownSelected = {{paddingLeft:15}}
                styleDropdownMenu = {{marginTop:20}}
                hideTags
                items={this.Newitem}
                uniqueKey="id"
                ref={(component) => { this.multiSelect = component }}
                onSelectedItemsChange={this.onSelectedItemsChange}
                selectedItems={selectedItems}
                selectText="Users"
                searchInputPlaceholderText="Search Name..."
                onChangeInput={ (text)=> console.log(text)}
                tagRemoveIconColor="#68c5fc"
                tagBorderColor="#68c5fc"
                tagTextColor="#68c5fc"
                selectedItemTextColor="#68c5fc"
                selectedItemIconColor="#CCC"
                itemTextColor="#000"
                displayKey="name"
                searchInputStyle={{ color: '#CCC' }}
                submitButtonColor="#48d22b"
                submitButtonText="Submit"
              />
              <TextInput
                defaultValue={this.state.message_title}
                style={styles.Text_input_title}
                placeholder={Text_EN.Text_en.title}
                onChangeText={(message_title) => this.setState({message_title,errorText:false})}
              />
              {this.state.errorText==true?<Text style={{paddingLeft:15,color:'red'}}></Text>:null}
              <TextInput
                defaultValue={this.state.message_text}
                style={styles.Text_input_message}
                placeholder="Kommentar til din leder"
                multiline={true}
                numberOfLines={8}
                onChangeText={(message_text) => this.setState({message_text,errorText:false})}
              />
            </View>
            <View style={styles.dialog_submit_btn}>
              <TouchableOpacity style={{backgroundColor:'#00a1ff',padding:10,paddingRight:25,paddingLeft:25,borderRadius:5}} onPress={()=>this.message_send()}>
                <Text style={styles.submit_btn}>{Text_EN.Text_en.send_message}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Dialog>
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
          <View style={{flex:1}}>
            <TouchableOpacity onPress={()=>this.props.navigation.navigate('More_info',{Firstname:this.state.firstName,token:this.state.token})}>
              <View style={{flexDirection:'row',justifyContent:'center',alignContent:'center',alignItems:'center'}}>
                <Text style={styles.upper_txt}>{Text_EN.Text_en.cooperation}</Text>
                <Image
                  style={styles.diamond_icon_top}
                  source={require('../../uploads/diamond_img.png')}
                />
                <Text style={styles.upper_txt}>{Text_EN.Text_en.trust}</Text>
                <Image
                  style={styles.diamond_icon_top}
                  source={require('../../uploads/diamond_img.png')}
                />
                <Text style={styles.upper_txt}>{Text_EN.Text_en.justice}</Text>
              </View>
            </TouchableOpacity>
            <View style={{padding:20,marginTop:10}}>
              <FlatList
                style={styles.movie_list}
                data={this.state.messageData}
                showsVerticleScrollIndicator={false}
                renderItem={({item}) =><View style={styles.dynamic_list_view}>
                  {this.state.userId==item.receiver_id?
                    <Text style={styles.list_part1}>
                        {item.sender_name}
                    </Text>:<Text style={styles.list_part1}>
                        {item.receiver_name}
                    </Text>
                    }
                    <View style={styles.list_part2}>
                      <TouchableOpacity onPress={()=>this.messageForward(item.id)}>
                        <Image
                          style={styles.like_icon}
                          source={require('../../uploads/emailForward.png')}
                        />
                      </TouchableOpacity>
                      <Image
                        style={styles.like_icon}
                        source={require('../../uploads/emailReply.png')}
                      />
                      <TouchableOpacity onPress={()=>this.messageDeleteConfirm(item.id)}>
                        <Image
                          style={styles.like_icon}
                          source={require('../../uploads/delete.png')}
                        />
                      </TouchableOpacity>
                    </View>
                </View>}
                keyExtractor={({id}, index) => id}
              />
            </View>
          </View>
          {/* <View style={styles.text_view}>
            <Text style={styles.experience_likes}>Delte oplevelser</Text>            
            <FlatList
              style={styles.movie_list}
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
          </View> */}
        </View>
        {/* <View style={{flex:0.2,flexDirection:'row',marginLeft:12,marginRight:12}}>
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
        </View> */}
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
  text_view:{
    marginTop:15,
    flex:0.4,
    padding:20,    
  },
  dynamic_list_view:{
    flexDirection:'row',
    marginBottom:25,
  },
  like_icon:{
    width:width * 0.08,
    height:width * 0.08,
    marginLeft:10,
    marginRight:10
  },
  experience_likes:{
    fontWeight:'bold',
    color:'black',
    fontSize:width * 0.05,
    marginBottom:15
  },
  list_part1:{
    flex:0.6,
    fontSize:width * 0.055,
  },
  list_part2:{
    justifyContent:'center',
    flex:0.4,
    flexDirection:'row',
  },
  diamond_icon_top:{
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
  dialog_close_icon:{
    paddingBottom:10,
    justifyContent:'flex-end',
    alignItems:'flex-end',
    position:'absolute',
    top:0,
    right:-10,
  },
  Text_input_title:{
    paddingLeft:15,
    borderWidth: 1,
    textAlignVertical: "top",
    backgroundColor:"white",
    borderTopColor:'white',
    borderLeftColor:'white',
    borderBottomColor:'lightgrey',
    borderRightColor:'white',
    marginBottom:0,
    fontSize:15
  },
  Text_input_message:{
    paddingLeft:15,
    borderWidth: 1,
    textAlignVertical: "top",
    backgroundColor:"white",
    borderTopColor:'lightgrey',
    borderLeftColor:'lightgrey',
    borderBottomColor:'lightgrey',
    borderRightColor:'lightgrey',
    marginTop:30,
    marginBottom:15,
    borderRadius:15,
  },
  submit_btn:{
    textAlign:'center',
    color:'white',
    fontSize:width * 0.045,
    fontWeight:'bold'
  },
});  