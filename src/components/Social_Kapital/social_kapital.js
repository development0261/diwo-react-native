import React, {Component} from 'react';  
import {Dimensions, StyleSheet, Text, View,TouchableOpacity ,Image, Alert, ScrollView,Button,TextInput} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Card, Icon } from 'react-native-elements';
import { Dialog } from 'react-native-simple-dialogs';
import Text_EN from '../res/lang/static_text';
import {NavigationEvents} from 'react-navigation';
  
export default class social_kapital extends Component{
  myInterval="";
  constructor(props){
    super(props)
    this._retrieveData = this._retrieveData.bind(this);
    this.state = {
      tokenValue:"",
      token:"",
      firstName:"",
      firstAnswer:"",
      secondAnswer:"",
      thirdAnswer:"",
      fourthAnswer:"",
      fiveAnswer:"",
      commentbox:false,
      commentText:'',
      errorAlert:false,
      activeBtn:1,
      answerSend:false,
    }
    this._retrieveData();
  }
  page_reloaded = () => {
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

  redirect_measurement = () =>{
    this.props.navigation.navigate('Measurement',{Firstname:this.state.firstName,token:this.state.token});
  }

  send_answer = () =>{
    if(this.state.firstAnswer == "" || this.state.secondAnswer == "" || this.state.thirdAnswer == "" || this.state.fourthAnswer == "" || this.state.fiveAnswer == ""){
      this.setState({errorAlert:true});
    }else{
      var date = new Date().getDate(); //Current Date
      var month = new Date().getMonth() + 1; //Current Month
      var year = new Date().getFullYear(); //Current Year
      var hours = new Date().getHours(); //Current Hours
      var min = new Date().getMinutes(); //Current Minutes
      var sec = new Date().getSeconds(); //Current Seconds

      var reviewDate = year + '-' + month + '-' + date;
      var now = year + '-' + month + '-' + date +' '+ hours + ':' + min + ':' + sec;
      
      const user_details = this.state.token;
      var headers = new Headers();
      let auth ='Bearer '+user_details.token;
      headers.append("Authorization",auth);

      // if(this.state.commentText==""){
      //   this.setState({commentText:" "});
      // }

      var data = new FormData()
      data.append('user_id', this.state.userId);
      data.append('review_date',reviewDate);
      data.append('comment',this.state.commentText);
      data.append('question1',this.state.firstAnswer);
      data.append('question2',this.state.secondAnswer);
      data.append('question3',this.state.thirdAnswer);
      data.append('question4',this.state.fourthAnswer);
      data.append('question5',this.state.fiveAnswer);
      data.append('last_review_date',now);
      console.log(data);
      fetch("http://diwo.nu/public/api/addSocialKapital", {
          method: 'POST',
          headers: headers,
          body:  data,
      })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
          if(responseJson.status==200){
              console.log(responseJson);
              this.setState({answerSend:true,activeBtn:0});
          }else{
              alert("Something went wrong.");
          }
      }).catch((error) =>{
          console.error(error);
      });
    }    
  }
  
  inactive_press_comment = () =>{
    Alert.alert(
        '',
        Text_EN.Text_en.inactive_social_kapital_comment,
        [
            {
                text: 'Ok',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            // {text: 'Learn More', onPress: () => this.learnMore()},
        ],
        {cancelable: false},
    );
  }

  inactive_press = () =>{
    Alert.alert(
        '',
        Text_EN.Text_en.inactive_social_kapital_submit,
        [
            {
                text: 'Ok',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            // {text: 'Learn More', onPress: () => this.learnMore()},
        ],
        {cancelable: false},
    );
  }
  getDaysInMonth = (month,year) => {
    // Here January is 1 based
    //Day 0 is the last day in the previous month
   return new Date(year, month, 0).getDate();
  // Here January is 0 based
  // return new Date(year, month+1, 0).getDate();
  };

  componentDidMount(){
    const { navigation  } = this.props;
    this.setState({firstAnswer:"",secondAnswer:"",thirdAnswer:"",fourthAnswer:"",fiveAnswer:""});
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

      fetch("http://diwo.nu/public/api/lastAddedSocialkapital", {
        method: 'POST',
        headers: headers,
      })
      .then((response) => response.json())
      .then((responseJson) => {
        if(responseJson.status==200){
          console.log(responseJson);
          if(responseJson.kapital_data[0]){
            this.setState({lastReviewDate:responseJson.kapital_data[0].last_review_date});              
            var date = responseJson.kapital_data[0].last_review_date;
            var t = date.split(/[- :]/);
            var d = new Date(t[0], t[1]-1, t[2]);
              
            // Checking activation for the current month
            var now = new Date();
            let lastDate = this.getDaysInMonth(now.getMonth()+1,now.getFullYear())-3;
            let activationDate = now.getFullYear() + '-' + (now.getMonth()+1) + '-' + lastDate;
            var activet = activationDate.split(/[- :]/);
            let activeDate = new Date(activet[0], activet[1]-1, activet[2]);
            //console.log(activeDate);

            // Checking activation for the Previous month
            var now = new Date();
            let PrevlastDate = this.getDaysInMonth(now.getMonth(),now.getFullYear())-3;
            let PrevactivationDate = now.getFullYear() + '-' + (now.getMonth()) + '-' + PrevlastDate;
            var Prevt = PrevactivationDate.split(/[- :]/);
            let PrevactiveDate = new Date(Prevt[0], Prevt[1]-1, Prevt[2]);
           //console.log(PrevactiveDate);
            
            //check if database date and previous month activation date is same or not
            if(d.getTime() === PrevactiveDate.getTime() || d.getTime() === activeDate.getTime()){
              this.setState({activeBtn:0});
            }else{

            //Check for activation between the database date and current date.
            // let dateArray = [];
            // let count = 0;
              for(var dt = new Date(d); dt <= now; dt.setDate(dt.getDate() + 1)) {
                console.log(dt);
                if(dt.getTime() ===  PrevactiveDate.getTime() || dt.getTime() === activeDate.getTime()){
                  console.log("if");
                  this.setState({activeBtn:1});
                  break;
                }else if(dt.getTime() > activeDate.getTime()){
                  if(dt.getDate() > activeDate.getDate() && dt.getMonth()+1 == activeDate.getMonth()+1){
                    this.setState({activeBtn:0});
                  }else{
                    console.log("In else if");
                    this.setState({activeBtn:1});
                  }
                }else{
                  console.log("else");
                  this.setState({activeBtn:0});
                }
                // dateArray.push(dt.getTime());
              }
            }
          }else{
            this.setState({activeBtn:1});
          }
        }
      }).catch((error) =>{
          console.error(error);
      });
    }
  }
  render() {
    var {height, width} = Dimensions.get('window');
    return (
      <View style={styles.container}>
        <NavigationEvents onDidFocus={() => {this.page_reloaded()}} />
        <Dialog
          visible={this.state.commentbox}
          title="Kommentarer"
          onTouchOutside={() => this.setState({commentbox: false})} >
          <View style={{position:'relative'}}>
              <View style={styles.dialog_close_icon}>
                  <TouchableOpacity onPress={()=>this.setState({commentbox: false})}>
                    <Image
                      style={{width:width * 0.08, height:width * 0.08}}
                      source={require('../../uploads/close.png')}
                    />
                  </TouchableOpacity>
              </View>
              <View style={{paddingBottom:10}}>
                <Text style={styles.dialog_txt}>{Text_EN.Text_en.social_kapital_commentbox}</Text>
                <TextInput
                  style={{borderColor:'black',marginTop:15,paddingLeft:15, borderWidth: 1,textAlignVertical: "top",backgroundColor:"white",flexWrap:'wrap'}}
                  placeholder="Skriv kommentar her.."
                  multiline={true}
                  numberOfLines={5}
                  onChangeText={(commentText) => this.setState({commentText})}
                />
              </View>
              <View style={styles.dialog_submit_btn}>
                <Button color="#00a1ff" title="Send Kommentar" onPress={()=>this.setState({commentbox:false})}/>
              </View>
          </View>
      </Dialog>
      <Dialog
          visible={this.state.errorAlert}
          onTouchOutside={() => this.setState({errorAlert: false})} >
          <View style={{position:'relative'}}>
              <View style={styles.dialog_close_icon_submit}>
                  <TouchableOpacity onPress={()=>this.setState({errorAlert: false})}>
                    <Image
                      style={{width:width * 0.08, height:width * 0.08}}
                      source={require('../../uploads/close.png')}
                    />
                  </TouchableOpacity>
              </View>
              <View style={{paddingBottom:10}}>
                <Text style={styles.dialog_txt}>{Text_EN.Text_en.social_kapital_error}</Text>
              </View>
          </View>
      </Dialog>
      <Dialog
        visible={this.state.answerSend}
        onTouchOutside={() => this.setState({answerSend: false})} >
        <View style={{position:'relative'}}>
            <View style={styles.dialog_close_icon_submit}>
                <TouchableOpacity onPress={()=>this.setState({answerSend: false})}>
                  <Image
                    style={{width:width * 0.08, height:width * 0.08}}
                    source={require('../../uploads/close.png')}
                  />
                </TouchableOpacity>
            </View>
            <View style={{paddingBottom:10}}>
              <Text style={styles.dialog_txt}>{Text_EN.Text_en.social_kapital_submit_message}</Text>
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
      <View style={{flex:1,paddingBottom:15}}>
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
        <Text style={styles.social_title}><Text style={{fontWeight:'bold'}}>{Text_EN.Text_en.social_kapital}: </Text>{Text_EN.Text_en.socialkapital_title}</Text>
        <ScrollView>
          <Card borderRadius={15}>
            <View style={{flexDirection:'row'}}>
              <View style={styles.diamond_css}>
                <Image
                  style={styles.diamond_icon}
                  source={require('../../uploads/diamond_img.png')}
                />
              </View>
              <View style={styles.question_card_text}>
                <Text style={{fontSize:width*0.035}}>{Text_EN.Text_en.socialkapital_question_one}</Text>
              </View>
              <View style={styles.icon_view}>
                <TouchableOpacity style={styles.btn_view} onPress={()=>this.setState({firstAnswer:"green"})}>
                  <Image
                    style={this.state.firstAnswer=="green"?styles.active_review_icon:styles.review_icon}
                    source={require('../../uploads/like.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn_view} onPress={()=>this.setState({firstAnswer:"yellow"})}>
                  <Image
                    style={this.state.firstAnswer=="yellow"?styles.active_review_icon:styles.review_icon}
                    source={require('../../uploads/normal.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn_view} onPress={()=>this.setState({firstAnswer:"red"})}>
                  <Image
                    style={this.state.firstAnswer=="red"?styles.active_review_icon:styles.review_icon}
                    source={require('../../uploads/dislike.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </Card>
          <Card borderRadius={15}>
            <View style={{flexDirection:'row'}}>
              <View style={styles.diamond_css}>
                <Image
                  style={styles.diamond_icon}
                  source={require('../../uploads/diamond_img.png')}
                />
              </View>
              <View style={styles.question_card_text}>
                  <Text style={{fontSize:width*0.035}}>{Text_EN.Text_en.socialkapital_question_two}</Text>
              </View>
              <View style={styles.icon_view}>
                  <TouchableOpacity style={styles.btn_view} onPress={()=>this.setState({secondAnswer:"green"})}>
                    <Image
                      style={this.state.secondAnswer=="green"?styles.active_review_icon:styles.review_icon}
                      source={require('../../uploads/like.png')}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btn_view} onPress={()=>this.setState({secondAnswer:"yellow"})}>
                    <Image
                      style={this.state.secondAnswer=="yellow"?styles.active_review_icon:styles.review_icon}
                      source={require('../../uploads/normal.png')}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btn_view} onPress={()=>this.setState({secondAnswer:"red"})}>
                    <Image
                      style={this.state.secondAnswer=="red"?styles.active_review_icon:styles.review_icon}
                      source={require('../../uploads/dislike.png')}
                    />
                  </TouchableOpacity>
              </View>
            </View>
          </Card>
          <Card borderRadius={15}>
            <View style={{flexDirection:'row'}}>
              <View style={styles.diamond_css}>
                <Image
                  style={styles.diamond_icon}
                  source={require('../../uploads/diamond_img.png')}
                />
              </View>
              <View style={styles.question_card_text}>
                  <Text style={{fontSize:width*0.035}}>{Text_EN.Text_en.socialkapital_question_three}</Text>
              </View>
              <View style={styles.icon_view}>
                <TouchableOpacity style={styles.btn_view} onPress={()=>this.setState({thirdAnswer:"green"})}>
                  <Image
                    style={this.state.thirdAnswer=="green"?styles.active_review_icon:styles.review_icon}
                    source={require('../../uploads/like.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn_view} onPress={()=>this.setState({thirdAnswer:"yellow"})}>
                  <Image
                    style={this.state.thirdAnswer=="yellow"?styles.active_review_icon:styles.review_icon}
                    source={require('../../uploads/normal.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn_view} onPress={()=>this.setState({thirdAnswer:"red"})}>
                  <Image
                    style={this.state.thirdAnswer=="red"?styles.active_review_icon:styles.review_icon}
                    source={require('../../uploads/dislike.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </Card>
          <Card borderRadius={15}>
            <View style={{flexDirection:'row'}}>
              <View style={styles.diamond_css}>
                <Image
                  style={styles.diamond_icon}
                  source={require('../../uploads/diamond_img.png')}
                />
              </View>
              <View style={styles.question_card_text}>
                <Text style={{fontSize:width*0.035}}>{Text_EN.Text_en.socialkapital_question_four}</Text>
              </View>
              <View style={styles.icon_view}>
                <TouchableOpacity style={styles.btn_view} onPress={()=>this.setState({fourthAnswer:"green"})}>
                  <Image
                    style={this.state.fourthAnswer=="green"?styles.active_review_icon:styles.review_icon}
                    source={require('../../uploads/like.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn_view} onPress={()=>this.setState({fourthAnswer:"yellow"})}>
                  <Image
                    style={this.state.fourthAnswer=="yellow"?styles.active_review_icon:styles.review_icon}
                    source={require('../../uploads/normal.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn_view} onPress={()=>this.setState({fourthAnswer:"red"})}>
                  <Image
                    style={this.state.fourthAnswer=="red"?styles.active_review_icon:styles.review_icon}
                    source={require('../../uploads/dislike.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </Card>
          <Card borderRadius={15}>
            <View style={{flexDirection:'row'}}>
              <View style={styles.diamond_css}>
                <Image
                  style={styles.diamond_icon}
                  source={require('../../uploads/diamond_img.png')}
                />
              </View>
              <View style={styles.question_card_text}>
                <Text style={{fontSize:width*0.035}}>{Text_EN.Text_en.socialkapital_question_five}</Text>
              </View>
              <View style={styles.icon_view}>
                <TouchableOpacity style={styles.btn_view} onPress={()=>this.setState({fiveAnswer:"green"})}>
                  <Image
                    style={this.state.fiveAnswer=="green"?styles.active_review_icon:styles.review_icon}
                    source={require('../../uploads/like.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn_view} onPress={()=>this.setState({fiveAnswer:"yellow"})}>
                  <Image
                    style={this.state.fiveAnswer=="yellow"?styles.active_review_icon:styles.review_icon}
                    source={require('../../uploads/normal.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn_view} onPress={()=>this.setState({fiveAnswer:"red"})}>
                  <Image
                    style={this.state.fiveAnswer=="red"?styles.active_review_icon:styles.review_icon}
                    source={require('../../uploads/dislike.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </Card>
          
          {this.state.activeBtn == 0 ? 
          <View style={styles.submit_btn}>
            <TouchableOpacity onPress={()=>this.inactive_press_comment()}>
              <Text style={styles.inactive_btn_txt}>{Text_EN.Text_en.comment}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{marginLeft:10}} onPress={()=>this.inactive_press()}>
              <Text style={styles.inactive_btn_txt}>{Text_EN.Text_en.submit_answer}</Text>
            </TouchableOpacity>
          </View> :
          <View style={styles.submit_btn}>
            <TouchableOpacity onPress={()=>this.setState({commentbox:true})}>
              <Text style={styles.btn_txt}>{Text_EN.Text_en.comment}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{marginLeft:10}} onPress={()=>this.send_answer()}>
              <Text style={styles.btn_txt}>{Text_EN.Text_en.submit_answer}</Text>
            </TouchableOpacity>
          </View> 
          }
          <TouchableOpacity style={styles.redirect_submit_btn} onPress={()=>this.redirect_measurement()}>
              <Text style={styles.btn_redirect}>{Text_EN.Text_en.link_measurement_btn}</Text>
          </TouchableOpacity>
        </ScrollView>
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
  social_title:{
    fontSize:18,
    padding:25,
    paddingBottom:5,
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
  btn_txt:{
    textAlign:'center',
    color:'white',
    fontSize:width*0.045,
    padding:13,
    backgroundColor:'#00a1ff',
    borderRadius:5
  },
  inactive_btn_txt:{
    textAlign:'center',
    color:'white',
    fontSize:width*0.045,
    padding:13,
    backgroundColor:'#87d9f7',
    borderRadius:5
  },
  bottom_btn_txt:{
    textAlign:'center',
    color:'white',
    fontSize:width*0.042,
    padding:10,
    backgroundColor:'#00a1ff'
  },
  question_card_text:{
    flex:0.5,
    paddingRight:12,
    paddingLeft:12,
    fontSize:width*0.048
  },
  diamond_icon:{
    width:width * 0.146,
    height:width * 0.122
  },
  review_icon:{
    width:width * 0.11,
    height:width * 0.11,
    opacity:0.3
  },
  active_review_icon:{
    width:width * 0.11,
    height:width * 0.11,
    opacity:1
  },
  submit_btn:{
    justifyContent:'center',
    flexDirection:'row',
    marginTop:15
  },
  btn_view:{
    borderRadius:5
  },
  diamond_css:{
    flex:0.15,
    justifyContent:'center',
    alignItems:'center'
  },
  icon_view:{
    flex:0.35,
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row',
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
  dialog_submit_btn:{
    justifyContent:'center',
    alignItems:'center',
    flexDirection:"row",
    paddingTop:20
  },
  dialog_close_icon:{
    paddingBottom:10,
    justifyContent:'flex-end',
    alignItems:'flex-end',
    position:'absolute',
    top:-55,
    right:-5, 
  },
  dialog_close_icon_submit:{
    paddingBottom:10,
    justifyContent:'flex-end',
    alignItems:'flex-end',
    position:'absolute',
    top:0,
    right:-5, 
  },
  dialog_txt:{
    fontWeight: "bold",
    color:"black",
    fontSize:width*0.038,
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
  btn_redirect:{
    textAlign:'center',
    color:'white',
    fontSize:17,
    fontWeight:'bold'
  },
  redirect_submit_btn:{
    marginTop:10,
    marginRight:15,
    paddingTop:10,
    paddingBottom:10,
    paddingLeft:12,
    paddingRight:12,
    justifyContent:'center',
    alignSelf:'center',
    backgroundColor:'#00a1ff'
  },
});  