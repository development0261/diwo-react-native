import Login from './Login/login';
import Home from './Home/home';
import Logout from './Login/logout';
import Workjoy from './WorkJoy/workjoy';
import Experience from './Experience/experience';
import Message from './Message/message';
import Social_kapital from './Social_Kapital/social_kapital/';
import Measurement from './Measurement/measurement';
import Profile from './Profile/profile';
import More_info from './More_info/More_info'
import { createAppContainer,SafeAreaView } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator,DrawerItems } from 'react-navigation-drawer';
import React from 'react';
import {Image,Dimensions,ScrollView,View,Text} from 'react-native';
import Text_EN from './res/lang/static_text';


var {height, width} = Dimensions.get('window');

const Primary_Nav = createDrawerNavigator({
    Login: {
      screen: Login,
      navigationOptions: {
        drawerLabel: () => null
      }
    },
    Home: {
      screen: Home,
      navigationOptions:{
        drawerLabel:Text_EN.Text_en.Home,
        drawerIcon: (
          <Image
            source={require('../uploads/menu_logo/home.png')}
            style={{width:30, height:30}}
          />
        ),
      }
    },
    Workjoy: {
      screen: Workjoy,
      navigationOptions:{
        drawerLabel:Text_EN.Text_en.Arbejdsglaede,
        drawerIcon: (
          <Image
            source={require('../uploads/menu_logo/portfolio.png')}
            style={{width:30, height:30}}
          />
        ),
      }
    },
    Social_kapital: {
      screen: Social_kapital,
      navigationOptions:{
        drawerLabel:Text_EN.Text_en.Social_Kapital,
        drawerIcon: (
          <Image
            source={require('../uploads/menu_logo/question.png')}
            style={{width:30, height:30}}
          />
        ),
      }
    },
    Experience: {
      screen: Experience,
      navigationOptions:{
        drawerLabel:"Oplevelser",
        drawerIcon: (
          <Image
            source={require('../uploads/menu_logo/experiment-results.png')}
            style={{width:30, height:30}}
          />
        ),
      }
    },
    Message: {
      screen: Message,
      navigationOptions:{
        drawerLabel:"Beskeder",
        drawerIcon: (
          <Image
            source={require('../uploads/menu_logo/email.png')}
            style={{width:30, height:30}}
          />
        ),
      }
    },
    Measurement: {
      screen: Measurement,
      navigationOptions:{
        drawerLabel:Text_EN.Text_en.Mine_Malinger,
        drawerIcon: (
          <Image
            source={require('../uploads/menu_logo/graph.png')}
            style={{width:30, height:30}}
          />
        ),
      }
    },    
    Profile: {
      screen: Profile,
      navigationOptions:{
        drawerLabel:Text_EN.Text_en.Min_Profile,
        drawerIcon: (
          <Image
            source={require('../uploads/menu_logo/avatar.png')}
            style={{width:30, height:30}}
          />
        ),
      }
    },
    More_info: {
      screen: More_info,
      navigationOptions:{
        drawerLabel:Text_EN.Text_en.More_info,
        drawerIcon: (
          <Image
            source={require('../uploads/menu_logo/more.png')}
            style={{width:30, height:30}}
          />
        ),
      }
    },
    Logout: {
      screen: Logout,
      navigationOptions:{
        drawerLabel:Text_EN.Text_en.Logout,
        drawerIcon: (
          <Image
            source={require('../uploads/menu_logo/log-out.png')}
            style={{width:30, height:30}}
          />
        ),
      }
    },
  },{
    initialRouteName:'Home',
    drawerPosition: 'right',
    drawerType: "slide",
    // drawerOpenRouter:'DrawerOpen',
    // drawerCloseRouter:'DrawerClose',
    drawerBackgroundColor: "#01a2ff",
    drawerType:'front',
    drawerWidth:width*0.55,
    contentOptions: {
      inactiveTintColor: 'white',
      activeTintColor: 'white',
      activeBackgroundColor: '#87d9f7',
      labelStyle: {
        fontSize: 15,
      },
    }
});
  
const PrimaryNav = createAppContainer(Primary_Nav);
export default PrimaryNav;
  