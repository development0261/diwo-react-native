import React, {Component} from 'react';  
import {Dimensions, StyleSheet, Text, View,TouchableOpacity ,Image, ActivityIndicator, ScrollView,Alert,Linking} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Card, Icon } from 'react-native-elements';
import Carousel from 'react-native-snap-carousel';
import {NavigationEvents} from 'react-navigation';
import Text_EN from '../res/lang/static_text';

  
export default class home extends Component{
    constructor(props){
        super(props)
        this._retrieveData = this._retrieveData.bind(this);
        this.state = {
            username:"",
            password:"",
            token:"",
            firstName:"",
            dataSource:"",
            storeToken:"",
            count:"0",
            loading:true,
            isWorkjoy_active:0,
            isSocialKapital_active:0,
        }
        this._retrieveData();
        this.workjoyPage = this.workjoyPage.bind(this);
        this.page_reloaded = this.page_reloaded.bind(this);
        // this.help_workjoy = this.help_workjoy.bind(this);
        // this.learnMore = this.learnMore.bind(this);
    }
    page_reloaded(){
        this._retrieveData();
    }
    _retrieveData = async () => {
        try {
          const value = await AsyncStorage.getItem('visited_onces');
          console.log("token_value::"+value);
          if (value !== null ) {
            this.setState({storeToken:JSON.parse(value),count:1});
            this.componentDidMount();
          }else{
            this.props.navigation.navigate('Login');
          }
        } catch (error) {          
          alert(error);
        }        
    };
    like_click = (expr_id) => {
        var headers = new Headers();
        let auth ='Bearer '+this.state.token;
        headers.append("Authorization",auth);        
        fetch("http://diwo.nu/public/api/addExpLikes/"+expr_id, {
            method: 'GET',        
            headers: headers,
        })
        .then((response) => response.json())
        .then((responseJson) => {
            if(responseJson.status==200){
                this.componentDidMount();
            }
        }).catch((error) =>{
            console.error(error);
        });
    }

    dislike_click = (expr_id) => {
        var headers = new Headers();
        let auth ='Bearer '+this.state.token;
        headers.append("Authorization",auth);        
        fetch("http://diwo.nu/public/api/expDislike/"+expr_id, {
            method: 'GET',        
            headers: headers,
        })
        .then((response) => response.json())
        .then((responseJson) => {
            if(responseJson.status==200){
                this.componentDidMount();
            }
        }).catch((error) =>{
            console.error(error);
        });
    }
   

    workjoyPage(){
        this.props.navigation.navigate('Workjoy',{Firstname:this.state.firstName,token:this.state.token});
    }

    socialkapital_Page = () =>{
        this.props.navigation.navigate('Social_kapital',{Firstname:this.state.firstName,token:this.state.token});
    }

    experience_Page = () =>{
        this.props.navigation.navigate('Experience',{Firstname:this.state.firstName,token:this.state.token});
    }

    message_Page = () =>{
        this.props.navigation.navigate('Message',{Firstname:this.state.firstName,token:this.state.token});
    }

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
    
    getDaysInMonth = (month,year) => {
        // Here January is 1 based
        //Day 0 is the last day in the previous month
        return new Date(year, month, 0).getDate();
        // Here January is 0 based
        // return new Date(year, month+1, 0).getDate();
    };

    componentDidMount(){
        const { navigation  } = this.props;
        let user_details;
        const token_value = navigation.getParam('token', 'NO-ID');
        if(this.state.count=="1" && token_value=="NO-ID"){
            user_details  = this.state.storeToken;
            console.log(user_details.token);
            let stateToken = user_details.token;
            this.setState({token:stateToken});
            // if(user_details!='NO-ID'){
            //     this.setState({token:user_details.token});
            // }else{
            //     this.setState({token:token_value});
            // }
            // console.log(this.state.token);
        
            var headers = new Headers();
            let auth;
            if(token_value=='NO-ID'){
                auth ='Bearer '+user_details.token; 
            }else{
                auth ='Bearer '+token_value; 
            }
            // console.log(auth);
            headers.append("Authorization",auth);        
            fetch("http://diwo.nu/public/api/user", {
                method: 'POST',        
                headers: headers,
            })
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson){
                // console.log(responseJson);
                this.setState({firstName:responseJson.user.first_name,loading:true});
                }
            }).catch((error) =>{
                console.error(error);
            });

            var headers1 = new Headers();
            if(token_value=='NO-ID'){
                auth ='Bearer '+user_details.token; 
            }else{
                auth ='Bearer '+token_value; 
            }
            headers1.append("Authorization",auth);
            fetch("http://diwo.nu/public/api/userExperience", {
                method: 'POST',        
                headers: headers1,
            })
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson){
                // console.log(responseJson.experience);
                //this.setState({firstName:responseJson.user.first_name});
                this.setState({
                    dataSource:responseJson.experience,
                    loading:true
                })
                }
            }).catch((error) =>{
                console.error(error);
            });

            fetch("http://diwo.nu/public/api/lastAddedWorkJoy", {
                method: 'POST',        
                headers: headers,
            })
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.status==200){
                    // console.log(responseJson);
                    if(responseJson.workjoy_data[0]){
                        this.setState({lastReviewDate:responseJson.workjoy_data[0].last_review_date});
                        
                        var date = responseJson.workjoy_data[0].last_review_date;
                        var t = date.split(/[- :]/);
                        var d = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
                        
                        let dayWord = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                        var day = new Date().getDay(); //Current Date
                        var month = new Date().getMonth()+1; //Current month
                        var year = new Date().getFullYear(); //Current year
                        var hours = new Date().getHours(); //Current Hours
                        var min = new Date().getMinutes();
                        var now = new Date();
                        for (var dt = new Date(d); dt <= now; dt.setDate(dt.getDate() + 1)) {
                            // console.log(dayWord[dt.getDay()]);
                            if(dayWord[dt.getDay()] == "Thursday"){
                                console.log(dayWord[dt.getDay()]);
                                if(dt.getDate() == d.getDate() && dt.getMonth() == d.getMonth() && dt.getFullYear() == d.getFullYear()){                                
                                    this.setState({isWorkjoy_active:0});
                                }else{
                                    this.setState({isWorkjoy_active:1});
                                }
                                if(d.getDate() == now.getDate() && d.getMonth() == now.getMonth() && d.getFullYear() == now.getFullYear()){
                                    this.setState({isWorkjoy_active:0});
                                    //console.log("Hi");
                                }
                            }else if(dayWord[now.getDay()] == "Thursday"){
                                this.setState({isWorkjoy_active:1});
                            }else if(d.getDate() == now.getDate() && d.getMonth() == now.getMonth() && d.getFullYear() == now.getFullYear()){
                                this.setState({isWorkjoy_active:0});
                                console.log("Hi");
                            }
                        }
                        // var currentDate = year +'-'+ month +'-'+day;
                        var currentTime = dayWord[day] + ':' + hours + ':' + min;
                        if(currentTime == 'Thursday:00:00'){
                            this.setState({isWorkjoy_active:1})
                        }
                    }else{
                        this.setState({isWorkjoy_active:1})
                    }
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
                        this.setState({isSocialKapital_active:0});
                        }else{

                            //Check for activation between the database date and current date.
                            // let dateArray = [];
                            // let count = 0;
                            for(var dt = new Date(d); dt <= now; dt.setDate(dt.getDate() + 1)) {
                                // console.log(dt);
                                if(dt.getTime() ===  PrevactiveDate.getTime() || dt.getTime() === activeDate.getTime()){
                                // console.log("if");
                                this.setState({isSocialKapital_active:1});
                                break;
                                }else if(dt.getTime() > activeDate.getTime()){
                                if(dt.getDate() > activeDate.getDate() && dt.getMonth()+1 == activeDate.getMonth()+1){
                                    this.setState({isSocialKapital_active:0});
                                }else{
                                    // console.log("In else if");
                                    this.setState({isSocialKapital_active:1});
                                }
                                }else{
                                // console.log("else");
                                this.setState({isSocialKapital_active:0});
                                }
                                // dateArray.push(dt.getTime());
                            }
                        }
                    }else{
                        this.setState({isSocialKapital_active:1});
                    }
                }
            }).catch((error) =>{
                console.error(error);
            });
        }
        if(token_value!=="NO-ID"){
            var headers = new Headers();
            let auth ='Bearer '+token_value;
            headers.append("Authorization",auth);        
            fetch("http://diwo.nu/public/api/user", {
                method: 'POST',        
                headers: headers,
            })
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson){
                    this.setState({firstName:responseJson.user.first_name});
                }
            }).catch((error) =>{
                console.error(error);
            });

            var headers1 = new Headers();           
            auth ='Bearer '+token_value; 
            headers1.append("Authorization",auth);        
            fetch("http://diwo.nu/public/api/userExperience", {
                method: 'POST',        
                headers: headers1,
            })
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson){
                //this.setState({firstName:responseJson.user.first_name});
                this.setState({
                    dataSource:responseJson.experience,
                })
                }
            }).catch((error) =>{
                console.error(error);
            });

            fetch("http://diwo.nu/public/api/lastAddedWorkJoy", {
                method: 'POST',        
                headers: headers,
            })
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.status==200){
                    if(responseJson.workjoy_data[0]){
                        this.setState({lastReviewDate:responseJson.workjoy_data[0].last_review_date});
                        
                        var date = responseJson.workjoy_data[0].last_review_date;
                        var t = date.split(/[- :]/);
                        var d = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
                        
                        let dayWord = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                        var day = new Date().getDay(); //Current Date
                        var month = new Date().getMonth()+1; //Current month
                        var year = new Date().getFullYear(); //Current year
                        var hours = new Date().getHours(); //Current Hours
                        var min = new Date().getMinutes();
                        var now = new Date();
                        for (var dt = new Date(d); dt <= now; dt.setDate(dt.getDate() + 1)) {
                            if(dayWord[dt.getDay()] == "Thursday"){
                                if(dt.getDate() == d.getDate() && dt.getMonth() == d.getMonth() && dt.getFullYear() == d.getFullYear()){                                
                                    this.setState({isWorkjoy_active:0});
                                }else{
                                    this.setState({isWorkjoy_active:1});
                                }
                                if(dt.getDate() == now.getDate() && dt.getMonth() == now.getMonth() && dt.getFullYear() == now.getFullYear()){
                                    this.setState({isWorkjoy_active:0});
                                }
                            }else if(dayWord[now.getDay()] == "Thursday"){
                                this.setState({isWorkjoy_active:1});
                            }
                        }
                        // var currentDate = year +'-'+ month +'-'+day;
                        var currentTime = dayWord[day] + ':' + hours + ':' + min;
                        if(currentTime == 'Thursday:00:00'){
                            this.setState({isWorkjoy_active:1})
                        }
                    }else{
                        this.setState({isWorkjoy_active:1})
                    }
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
                        this.setState({isSocialKapital_active:0});
                        }else{

                            //Check for activation between the database date and current date.
                            // let dateArray = [];
                            // let count = 0;
                            for(var dt = new Date(d); dt <= now; dt.setDate(dt.getDate() + 1)) {
                                // console.log(dt);
                                if(dt.getTime() ===  PrevactiveDate.getTime() || dt.getTime() === activeDate.getTime()){
                                // console.log("if");
                                this.setState({isSocialKapital_active:1});
                                break;
                                }else if(dt.getTime() > activeDate.getTime()){
                                if(dt.getDate() > activeDate.getDate() && dt.getMonth()+1 == activeDate.getMonth()+1){
                                    this.setState({isSocialKapital_active:0});
                                }else{
                                    // console.log("In else if");
                                    this.setState({isSocialKapital_active:1});
                                }
                                }else{
                                // console.log("else");
                                this.setState({isSocialKapital_active:0});
                                }
                                // dateArray.push(dt.getTime());
                            }
                        }
                    }else{
                        this.setState({isSocialKapital_active:1});
                    }
                }
            }).catch((error) =>{
                console.error(error);
            });
        }
    }
    _renderItem = ({item, index}) => {
        var {height, width} = Dimensions.get('window');
        return (
            <View style={styles.dynamic_list_view}>                    
                <Card borderRadius={15} containerStyle={{marginLeft:12,backgroundColor:'#00a1ff',width:'95%'}}>
                    <View>
                        <Text style={{textAlign:'center',color:'white',fontSize:width*0.035}}>{item.experience} {"\n"} {item.date} {"\n"} {item.user_name} {item.team_name} </Text>
                        <View style={{flexDirection:'row',justifyContent:'flex-end',alignContent:'flex-end'}}>
                            {item.user_likes==0?<TouchableOpacity onPress={()=>this.like_click(item.id)}><Image
                                style={styles.like_icon}
                                source={require('../../uploads/heart1.png')}
                            /></TouchableOpacity>:<TouchableOpacity onPress={()=>this.dislike_click(item.id)}><Image
                                    style={styles.like_icon}
                                    source={require('../../uploads/liked_heart.png')}
                                /></TouchableOpacity>}
                            <Text style={styles.like_count}>
                                {item.total_likes} likes
                            </Text>
                        </View>
                    </View>
                </Card>
            </View>
        );
    }
    render() {
        var {height, width} = Dimensions.get('window');
        return (
        <View style={styles.container}>
            {/* {this.state.loading && <View style={styles.spinner} pointerEvents={'none'} >
              <ActivityIndicator size="large" color="#19e600" animating={this.state.loading}/>
            </View>} */}
            <NavigationEvents onDidFocus={() => {this.page_reloaded()}} />
            <Image
                style={styles.background_diamond}
                source={require('../../uploads/diamond-dark.png')}
            />
            <View style={{padding:10,flexDirection:'row',borderBottomColor:'#01a2ff',borderBottomWidth:2}}>
                <View style={{flex:width*0.00112}}>
                    <Text style={{fontSize:18}}>Hej <Text style={{fontWeight:"bold",fontSize:18}}>{this.state.firstName}</Text></Text>
                </View>
                <View style={{flex:width*0.0014}}>
                    <Image
                        style={{width:80, height:30}}
                        source={require('../../uploads/Diwologo_png.png')}
                    />
                </View>
                <View style={{flex:width*0.00032,justifyContent:'flex-end',alignSelf:'flex-end'}}>
                    <TouchableOpacity onPress={()=>this.props.navigation.openDrawer()}>
                    <Image
                        style={{width:35, height:30}}
                        source={require('../../uploads/drawer_menu.png')}
                    />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{flex:height * 0.0028 }}>
                <Carousel
                    ref={(c) => { this._carousel = c; }}
                    data={this.state.dataSource}
                    renderItem={this._renderItem}
                    sliderWidth={width*1}
                    itemWidth={width*1}
                    autoplay={true}
                    autoplayDelay={10000}
                    loop={true}
                />
            </View>
            <View style={{flex:5,paddingBottom:10,backgroundColor:'transparent'}}>
                <ScrollView>
                <Card borderRadius={15}>
                    <View style={{flexDirection:'row'}}>
                        <View style={{flex:0.2,justifyContent:'center',alignItems:'center'}}>
                            <Image
                                style={styles.diamond_icon}
                                source={require('../../uploads/diamond_img.png')}
                            />
                        </View>
                        <View style={styles.question_card_text}>
                            <Text style={{fontSize:width*0.042}}>{Text_EN.Text_en.message_card_txt}</Text>
                        </View>
                        <View style={{flex:0.3,justifyContent:'center'}}>
                            <TouchableOpacity style={styles.btn_view} onPress={()=>this.message_Page()}>
                                <Text style={styles.submit_btn}>{Text_EN.Text_en.home_msg_btn}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Card>
                <Card borderRadius={15}>
                    <View style={{flexDirection:'row'}}>
                        <View style={{flex:0.2,justifyContent:'center',alignItems:'center'}}>
                            <Image
                                style={styles.diamond_icon}
                                source={require('../../uploads/diamond_img.png')}
                            />
                        </View>
                        <View style={styles.question_card_text}>
                            <Text style={{fontSize:width*0.042}}>{Text_EN.Text_en.experience_card_text}</Text>
                        </View>
                        <View style={{flex:0.3,justifyContent:'center'}}>
                            <TouchableOpacity style={styles.btn_view} onPress={()=>this.experience_Page()}>
                                <Text style={styles.submit_btn}> {Text_EN.Text_en.home_exp_share_btn} </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Card>
                <Card borderRadius={15}>
                    <View style={{flexDirection:'row',justifyContent:'center',alignContent:'center'}}>
                        <View style={{flex:0.2,justifyContent:'center',alignItems:'center'}}>
                            <Image
                                style={styles.diamond_icon}
                                source={require('../../uploads/diamond_img.png')}
                            />
                            {this.state.isWorkjoy_active==1?<Text style={styles.indicator}></Text>:null}
                        </View>
                        <View style={styles.question_card_text}>
                            <Text style={{fontSize:width*0.042}}>{Text_EN.Text_en.workjoy_card_text}</Text>
                        </View>
                        <View style={{flex:0.3,justifyContent:'center'}}>
                            <TouchableOpacity style={styles.btn_view} onPress={()=>this.workjoyPage()}>
                                <Text style={styles.submit_btn}> {Text_EN.Text_en.home_btn_send} </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Card>
                <Card borderRadius={15}>
                    <View style={{flexDirection:'row'}}>
                        <View style={{flex:0.2,justifyContent:'center',alignItems:'center'}}>
                            <Image
                                style={styles.diamond_icon}
                                source={require('../../uploads/diamond_img.png')}
                            />
                            {this.state.isSocialKapital_active==1?<Text style={styles.kapitalIndicator}></Text>:null}
                        </View>
                        <View style={styles.question_card_text}>
                            <Text style={{fontSize:width*0.042}}>{Text_EN.Text_en.socialkapital_card_text}</Text>
                        </View>
                        <View style={{flex:0.3,justifyContent:'center'}}>
                            <TouchableOpacity style={styles.btn_view} onPress={()=>this.socialkapital_Page()}>
                                <Text style={styles.submit_btn}> {Text_EN.Text_en.home_btn_send} </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Card>
                </ScrollView>
            </View>
            {/* <View style={{flex:1.2,flexDirection:'row',marginLeft:12,marginRight:12}}>
                <View style={styles.bottom_btn}>
                    <TouchableOpacity onPress={()=>this.help_workjoy()}>
                        <Text style={styles.bottom_btn_text}>{Text_EN.Text_en.bottom_btn_one_txt}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.bottom_btn}>
                    <TouchableOpacity onPress={()=>this.help_socialkapital()}>
                        <Text style={styles.bottom_btn_text}>{Text_EN.Text_en.bottom_btn_two_txt}</Text>
                    </TouchableOpacity>
                </View>                
                <View style={styles.bottom_btn}>
                    <TouchableOpacity onPress={()=>this.help_experience()}>
                        <Text style={styles.bottom_btn_text}>{Text_EN.Text_en.bottom_btn_three_txt}</Text>
                    </TouchableOpacity>
                </View>
            </View> */}
        </View>
        );  
    }
}  
var {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({  
  container: {  
    flex: 1,    
    position:'relative',
  },
  dynamic_list_view:{
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom:25
  },
  icon: {
    width: 24,
    height: 24,
  },
  question_card_text:{
    flex:0.5,
    paddingRight:12,
    paddingLeft:12,
  },
  bottom_btn:{
    width:'30.333%',
    backgroundColor:'#00a1ff',
    marginLeft:width*0.028,
    marginTop:0,
    marginBottom:2,
    borderRadius:10,
    justifyContent:'center'
  },
  bottom_btn_text:{
    textAlign:'center',
    color:'white',
    fontSize:width*0.042,
    padding:10,
  },
  spinner: {
    height:'100%',
    width:'100%',
    justifyContent: 'center',
    position:'absolute',
    zIndex:2,    
  },
  submit_btn:{
    textAlign:'center',
    color:'white',
    fontSize:width * 0.038,
    fontWeight:'bold'
  },
  btn_view:{
    padding:8,
    backgroundColor:'#00a1ff',
    borderRadius:5
  },
  diamond_icon:{
    width:width * 0.17,
    height:width * 0.1216
  },
  like_count:{
    textAlign:'right',
    color:'white',
    marginTop:5,
    fontSize:width*0.038,
  },
  like_icon:{
    width:width*0.057,
    height:width*0.057,
    marginTop:5,
    marginRight:5
  },
  indicator:{
    width:width * 0.05,
    height:width * 0.05,
    backgroundColor:'#00a1ff',
    borderRadius:75,
    position:'absolute',
    right:0,
    top:-2,
    borderColor:'white',
    borderWidth:2.5
  },
  kapitalIndicator:{
    width:width * 0.05,
    height:width * 0.05,
    backgroundColor:'#00a1ff',
    borderRadius:75,
    position:'absolute',
    right:0,
    top:20,
    borderColor:'white',
    borderWidth:2.5
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
});