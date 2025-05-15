import { StatusBar, LogBox,TouchableOpacity } from "react-native"
import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import Icon from "react-native-vector-icons/Ionicons"
import { BlurView } from "@react-native-community/blur"
import LinearGradient from "react-native-linear-gradient"


// Screens
import SplashScreen from "./screens/SplashScreen"
import HomeScreen from "./screens/HomeScreen"
import NFTDetailScreen from "./screens/NFTDetailScreen"
import ProfileScreen from "./screens/ProfileScreen"
import WalletScreen from "./screens/WalletScreen"
import CreateScreen from "./screens/CreateScreen"
import NotificationsScreen from "./screens/NotificationsScreen"
import DetailCollection from "./screens/DetailCollection"

// Ignore specific warnings
LogBox.ignoreLogs(["ViewPropTypes will be removed", "ColorPropType will be removed"])

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

// Custom tab bar button component
const TabBarButton = ({ children, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 8,
        backgroundColor: "black", 
      }}
    >
      {children}
    </TouchableOpacity>
  )
}

// Main tab navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          height: 70,
          borderTopWidth: 0,
          backgroundColor: "transparent",
          position: "absolute",
          elevation: 0,
          borderTopColor: "rgba(255, 255, 255, 0.1)",
        },
        tabBarButton: (props) => <TabBarButton {...props} />,
        tabBarActiveTintColor: "#FF3DFF",
        tabBarInactiveTintColor: "rgba(255, 255, 255, 0.5)",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
          marginBottom: 5,
        },
        tabBarIconStyle: {
          marginTop: 5,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Icon name="grid-outline" color={color} size={22} />,
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={WalletScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Icon name="wallet-outline" color={color} size={22} />,
        }}
      />
      <Tab.Screen
        name="Create"
        component={CreateScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <LinearGradient
              colors={["#FF3DFF", "#5D00FF"]}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 5,
              }}
            >
              <Icon name="add" color="#FFFFFF" size={26} />
            </LinearGradient>
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Icon name="notifications-outline" color={color} size={22} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Icon name="person-outline" color={color} size={22} />,
        }}
      />
    </Tab.Navigator>
  )
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Splash"
            screenOptions={{
              headerShown: false,
              animation: "fade",
            }}
          >
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="NFTDetail" component={NFTDetailScreen} />
            <Stack.Screen name="DetailCollection" component={DetailCollection}/>
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
