import React, {Component} from 'react';  
import {Dimensions, StyleSheet, Text, View,TouchableOpacity ,Image, Alert, ScrollView,TextInput} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Card, Icon } from 'react-native-elements';
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
            yellow_selected:1,
            red_selected:"",
            green_selected:"",
            count:0,
            greenDialogVisible:false,
            redDialogVisible:false,
            yellowDialogVisible:false,
            threeTimesRed:false,
            lastReviewDate:"",
            submit_btn_active:0,
            userId:"",
            commentBox:false,
            commentText:"",
            last_inserted_id:"",
            message_dialog:false,
            message_title:"",
            message_text:"",
            title:"",
            message:"",
            selectedItems : [],
            errorText:""

        }
        this._retrieveData();
        this.yellow_selected = this.yellow_selected.bind(this);
        this.red_selected = this.red_selected.bind(this);
        this.green_selected = this.green_selected.bind(this);
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
    red_selected(){
        this.setState({yellow_selected:"",green_selected:"",red_selected:1});
    }
    green_selected(){
        this.setState({yellow_selected:"",green_selected:1,red_selected:""});
    }
    yellow_selected(){
        this.setState({yellow_selected:1,green_selected:"",red_selected:""});
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
                text: 'Ok',
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
                text: 'Ok',
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
                text: 'Ok',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {text: 'Learn More', onPress: () => this.learnMore()},
            ],
            {cancelable: false},
        );
    }

    send_answer = () =>{
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

        if(this.state.green_selected==1){
            var review_value = Text_EN.Text_en.workjoy_green_selected;            
            var data = new FormData()
            data.append('user_id', this.state.userId);
            data.append('review_date',reviewDate);
            data.append('review',review_value);
            data.append('last_review_date',now);
            console.log(data);
            fetch("http://diwo.nu/public/api/addWorkJoy", {
                method: 'POST',
                headers: headers,
                body:  data,
            })
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.status==200){
                    console.log(responseJson);
                    this.setState({submit_btn_active:0});
                    this.setState({greenDialogVisible:true});
                    this.setState({last_inserted_id:responseJson.last_inserted_id});
                }else{
                    alert("Something went wrong. Please try later.");
                }
            }).catch((error) =>{
                console.error(error);
            });
        }
        else if(this.state.red_selected==1){
            var review_value = Text_EN.Text_en.workjoy_red_selected;
            var data = new FormData()
            data.append('user_id', this.state.userId);
            data.append('review_date',reviewDate);
            data.append('review',review_value);
            data.append('last_review_date',now);
            console.log(data);
            fetch("http://diwo.nu/public/api/addWorkJoy", {
                method: 'POST',
                headers: headers,
                body:  data,
            })
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.status==200){
                    console.log(responseJson);
                    this.setState({submit_btn_active:0});

                    fetch("http://diwo.nu/public/api/latestWorkJoy", {
                        method: 'POST',
                        headers: headers,
                    })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        if(responseJson.status==200){
                            let count=0;
                            for(var i=0;i<responseJson.workjoy_data.length;i++){
                                if(responseJson.workjoy_data[i].review == review_value){
                                    count = count + 1;
                                }else{
                                    console.log("else");
                                    count=0;
                                }
                                // console.log(count);console.log("if");
                            }
                            if(count>1){
                                this.setState({threeTimesRed:true});
                            }else{
                                this.setState({redDialogVisible:true});
                            }
                        }else{
                            alert("Something went wrong. Please try later.");
                        }
                    }).catch((error) =>{
                        console.error(error);
                    });
                }else{
                    alert("Something went wrong. Please try later.");
                }
            }).catch((error) =>{
                console.error(error);
            });
            
        }else{
            var review_value = Text_EN.Text_en.workjoy_yellow_selected;
            var data = new FormData()
            data.append('user_id', this.state.userId);
            data.append('review_date',reviewDate);
            data.append('review',review_value);
            data.append('last_review_date',now);
            console.log(data);
            fetch("http://diwo.nu/public/api/addWorkJoy", {
                method: 'POST',
                headers: headers,
                body:  data,
            })
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.status==200){
                    console.log(responseJson);
                    this.setState({submit_btn_active:0});
                    this.setState({yellowDialogVisible:true});
                    this.setState({last_inserted_id:responseJson.last_inserted_id});
                }else{
                    alert("Something went wrong. Please try later.");
                }
            }).catch((error) =>{
                console.error(error);
            });
        }
    }

    save_comment = () =>{
        console.log(this.state.commentText);
        console.log(this.state.last_inserted_id);
        const user_details = this.state.token;
        var headers = new Headers();
        let auth ='Bearer '+user_details.token;
        headers.append("Authorization",auth);

        var data = new FormData()
        data.append('id', this.state.last_inserted_id);
        data.append('comments',this.state.commentText);
        console.log(data);
        fetch("http://diwo.nu/public/api/updateCommentsWorkJoy ", {
            method: 'POST',
            headers: headers,
            body:  data,
        })
        .then((response) => response.json())
        .then((responseJson) => {
            if(responseJson){
                console.log(responseJson);
                this.setState({commentBox:false,greenDialogVisible:false});
            }else{
                alert("Something went wrong. Please try later.");
            }
        }).catch((error) =>{
            console.error(error);
        });
    }

    inactive_press = () =>{        
        Alert.alert(
            '',
            Text_EN.Text_en.inactive_workjoy_submit,
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

    experience_Page = () =>{        
        this.props.navigation.navigate('Experience',{Firstname:this.state.firstName,token:this.state.token});
        this.setState({greenDialogVisible: false});
    }

    redirect_measurement = () =>{
        this.props.navigation.navigate('Measurement',{Firstname:this.state.firstName,token:this.state.token});
    }

    componentDidMount(){
        this.setState({yellow_selected:1,red_selected:0,green_selected:0});
        const { navigation  } = this.props;
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

            fetch("http://diwo.nu/public/api/lastAddedWorkJoy", {
                method: 'POST',        
                headers: headers,
            })
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.status==200){
                    console.log(responseJson);
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
                                    this.setState({submit_btn_active:0});
                                }else{
                                    this.setState({submit_btn_active:1});
                                }
                                if(dt.getDate() == now.getDate() && dt.getMonth() == now.getMonth() && dt.getFullYear() == now.getFullYear()){
                                    this.setState({submit_btn_active:0});
                                }
                            }else if(dayWord[now.getDay()] == "Thursday"){
                                this.setState({submit_btn_active:1});
                            }
                        }
                        // var currentDate = year +'-'+ month +'-'+day;
                        var currentTime = dayWord[day] + ':' + hours + ':' + min;
                        if(currentTime == 'Thursday:12:00'){
                            this.setState({submit_btn_active:1});
                        }
                    }else{
                        this.setState({submit_btn_active:1});
                    }
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
            <Dialog
                visible={this.state.greenDialogVisible}
                onTouchOutside={() => this.setState({greenDialogVisible: false})} >
                <View style={{position:'relative'}}>
                    <View style={styles.dialog_close_icon}>
                        <TouchableOpacity onPress={()=>this.setState({greenDialogVisible: false})}>
                            <Image
                                style={{width:width * 0.08, height:width * 0.08}}
                                source={require('../../uploads/close.png')}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{paddingBottom:10,marginTop:50}}>
                      <Text style={styles.dialog_txt}>{Text_EN.Text_en.workjoy_greenselected_popup}</Text>
                    </View>
                    <View style={styles.dialog_submit_btn}>
                        <TouchableOpacity style={{backgroundColor:'#00a1ff',padding:10,paddingRight:25,paddingLeft:25,borderRadius:5}} onPress={()=>{this.setState({commentBox:true,greenDialogVisible:false})}}>
                            <Text style={styles.submit_btn}>{Text_EN.Text_en.yes}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{marginLeft:15,backgroundColor:'#00a1ff',padding:10,paddingRight:25,paddingLeft:25,borderRadius:5}} onPress={()=>this.experience_Page()}>
                            <Text style={styles.submit_btn}>{Text_EN.Text_en.share_experience}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Dialog>
            <Dialog
                visible={this.state.redDialogVisible}
                onTouchOutside={() => this.setState({redDialogVisible: false})} >
                <View style={{position:'relative'}}>
                    <View style={styles.dialog_close_icon}>
                        <TouchableOpacity onPress={()=>this.setState({redDialogVisible: false})}>
                            <Image
                                style={{width:width * 0.08, height:width * 0.08}}
                                source={require('../../uploads/close.png')}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{paddingBottom:10,marginTop:50}}>
                      <Text style={styles.dialog_txt}>{Text_EN.Text_en.workjoy_redselected_popup}</Text>
                    </View>
                    <View style={styles.dialog_submit_btn}>
                        <TouchableOpacity style={{marginLeft:15,backgroundColor:'#00a1ff',padding:10,paddingRight:25,paddingLeft:25,borderRadius:5}}>
                            <Text style={styles.submit_btn}>{Text_EN.Text_en.send_message}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Dialog>
            <Dialog
                visible={true}>
                <View style={{position:'relative'}}>
                    <View style={{paddingBottom:10,marginTop:50}}>
                      <Text style={styles.dialog_txt}>{Text_EN.Text_en.three_time_red}</Text>
                    </View>
                    <View style={styles.dialog_submit_btn}>
                        <TouchableOpacity style={{marginLeft:15,backgroundColor:'#00a1ff',padding:10,paddingRight:25,paddingLeft:25,borderRadius:5}} onPress={()=>{this.setState({message_dialog:true})}}>
                            <Text style={styles.submit_btn}>{Text_EN.Text_en.send_message}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Dialog>
            <Dialog
                visible={this.state.yellowDialogVisible}
                onTouchOutside={() => this.setState({yellowDialogVisible: false})} >
                <View style={{position:'relative'}}>
                    <View style={styles.dialog_close_icon}>
                        <TouchableOpacity onPress={()=>this.setState({yellowDialogVisible: false})}>
                            <Image
                                style={{width:width * 0.08, height:width * 0.08}}
                                source={require('../../uploads/close.png')}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{paddingBottom:10,marginTop:50}}>
                      <Text style={styles.dialog_txt}>{Text_EN.Text_en.workjoy_yellowselected_popup}</Text>
                    </View>
                    <View style={styles.dialog_submit_btn}>
                        <TouchableOpacity style={{backgroundColor:'#00a1ff',padding:10,paddingRight:25,paddingLeft:25,borderRadius:5}} onPress={()=>{this.setState({commentBox:true,yellowDialogVisible:false})}}>
                            <Text style={styles.submit_btn}>{Text_EN.Text_en.yes}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{marginLeft:15,backgroundColor:'#00a1ff',padding:10,paddingRight:25,paddingLeft:25,borderRadius:5}} onPress={()=>this.experience_Page()}>
                            <Text style={styles.submit_btn}>{Text_EN.Text_en.send_message}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Dialog>
            <Dialog
                visible={this.state.commentBox}
                title="Kommentar"
                onTouchOutside={() => this.setState({commentBox: false})} >
                <View style={{position:'relative'}}>
                    <View style={styles.dialog_close_icon}>
                        <TouchableOpacity onPress={()=>this.setState({commentBox: false})}>
                            <Image
                                style={{width:width * 0.08, height:width * 0.08}}
                                source={require('../../uploads/close.png')}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{paddingBottom:10,marginTop:50}}>
                        <TextInput style={styles.Text_input}
                            placeholder="skriv din kommentar..."
                            multiline={true}
                            numberOfLines={4}
                            onChangeText={(commentText) => this.setState({commentText})}/>
                    </View>
                    <View style={styles.dialog_submit_btn}>
                        <TouchableOpacity style={{backgroundColor:'#00a1ff',padding:10,paddingRight:25,paddingLeft:25,borderRadius:5}} onPress={()=>this.save_comment()}>
                            <Text style={styles.submit_btn}>{Text_EN.Text_en.submit}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{marginLeft:15,backgroundColor:'#00a1ff',padding:10,paddingRight:25,paddingLeft:25,borderRadius:5}} onPress={()=>{this.setState({commentBox:false})}}>
                            <Text style={styles.submit_btn}>{Text_EN.Text_en.cancel}</Text>
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
            <View style={{flex:1}}>
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
                <Text style={styles.workjoy_title}><Text style={{fontSize:width * 0.045,fontWeight:'bold'}}>{Text_EN.Text_en.job_satisfaction}: </Text>{Text_EN.Text_en.workjoy_title}</Text>
                <TouchableOpacity onPress={()=>this.green_selected()}>
                    <Card borderRadius={10}>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                        {this.state.green_selected==1?<Image
                                style={{width:50, height:50}}
                                source={require('../../uploads/g1.png')}
                            />:<Image
                                style={{width:50, height:50}}
                                source={require('../../uploads/green.png')}
                            />}
                            <Text style={styles.question_txt}>{Text_EN.Text_en.workjoy_good_week}</Text>
                        </View>
                    </Card>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>this.yellow_selected()}>
                    <Card borderRadius={10}>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            {this.state.yellow_selected==1?<Image
                                style={{width:50, height:50}}
                                source={require('../../uploads/y1.png')}
                            />:<Image
                                style={{width:50, height:50}}
                                source={require('../../uploads/yellow.png')}
                            />}
                            <Text style={styles.question_txt}>{Text_EN.Text_en.workjoy_normal_week}</Text>
                        </View>
                    </Card>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>this.red_selected()}>
                    <Card borderRadius={10}>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            {this.state.red_selected==1?<Image
                                style={{width:50, height:50}}
                                source={require('../../uploads/r1.png')}
                            />:<Image
                                style={{width:50, height:50}}
                                source={require('../../uploads/red.png')}
                            />}
                            <Text style={styles.question_txt}> {Text_EN.Text_en.workjoy_not_good}</Text>
                        </View>
                    </Card>
                </TouchableOpacity>                
                {this.state.submit_btn_active==0 ?
                <TouchableOpacity style={styles.inactive_submit_btn} onPress={()=>this.inactive_press()}>
                    <Text style={styles.submit_btn}>{Text_EN.Text_en.submit_answer}</Text>
                </TouchableOpacity> : 
                <TouchableOpacity style={styles.active_submit_btn} onPress={()=>this.send_answer()}>
                    <Text style={styles.submit_btn}>{Text_EN.Text_en.submit_answer}</Text>
                </TouchableOpacity> }
                <TouchableOpacity style={styles.active_submit_btn} onPress={()=>this.redirect_measurement()}>
                    <Text style={styles.submit_btn}>{Text_EN.Text_en.link_measurement_btn}</Text>
                </TouchableOpacity>
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
  question_txt:{
      marginLeft:25,
      fontSize:width*0.045
  },
  active_submit_btn:{
    marginTop:10,
    marginRight:15,
    paddingTop:10,
    paddingBottom:10,
    paddingLeft:12,
    paddingRight:12,
    justifyContent:'flex-end',
    alignSelf:'flex-end',
    backgroundColor:'#00a1ff'
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
  inactive_submit_btn:{
    marginTop:10,
    marginRight:15,
    paddingTop:10,
    paddingBottom:10,
    paddingLeft:12,
    paddingRight:12,
    justifyContent:'flex-end',
    alignSelf:'flex-end',
    backgroundColor:'#87d9f7',
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
  dialog_txt:{
    fontWeight: "bold",
    color:"black",
    fontSize:width*0.038,
  },
  dialog_close_icon:{
    paddingBottom:10,
    justifyContent:'flex-end',
    alignItems:'flex-end',
    position:'absolute',
    top:0,
    right:-10,
  },
  workjoy_title:{
    fontSize:width * 0.045,
    padding:25,
    paddingBottom:0
  },
  submit_btn:{
    textAlign:'center',
    color:'white',
    fontSize:17,
    fontWeight:'bold'
  },
  dialog_submit_btn:{
    justifyContent:'center',
    alignItems:'center',
    flexDirection:"row",
    paddingTop:20
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
    Text_input:{
        paddingLeft:15,
        borderWidth: 1,
        textAlignVertical: "top",
        backgroundColor:"white",
        borderTopColor:'black',
        borderLeftColor:'black',
        borderBottomColor:'black',
        borderRightColor:'black',        
        marginBottom:0,
        borderRadius:15,
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
});  