import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HomeHeader } from '@/components/home/HomeHeader';
import { HomeScreen } from '@/components/home/HomeScreen';
import { StoolRecordDetails } from '@/components/home/StoolRecordDetails';
import { StoolRecordDetailsHeaderRight } from '@/components/home/StoolRecordDetailsHeaderRight';
import LoginScreen from '@/components/log-in/LoginScreen';
import { useAuth } from '@/services/auth/AuthContext';
import { RootStackParamList } from '@/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigation() {
  const { user } = useAuth();

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Main" 
          component={HomeScreen} 
          options={{ header: () => <HomeHeader /> }}
        />
        <Stack.Screen 
          name="StoolRecordDetails" 
          component={StoolRecordDetails}
          options={({ route }) => ({
            title: 'Record Details',
            headerStyle: {
              backgroundColor: '#2563eb',
            },
            headerTintColor: '#fff',
            headerRight: () => (
              <StoolRecordDetailsHeaderRight recordId={route.params.id} />
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}