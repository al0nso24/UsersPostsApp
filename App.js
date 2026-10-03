import { NavigationContainer } from '@react-navigation/native';
import UsersScreen from './screens/UsersScreen';
import PostsScreen from './screens/PostsScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { View } from 'react-native';
import { StyleSheet } from 'react-native';

const Stack = createStackNavigator(); //esto crea el navegador

export default function App() {
  return (
    <View style={styles.container}>
      {/*Contenedor global que habilita la navegación dentro de la app*/}
      <NavigationContainer>
        {/*Navegador principal*/}
        <Stack.Navigator>
          <Stack.Screen name="Users" component={UsersScreen} />
          <Stack.Screen name="Posts" component={PostsScreen}
            //Muestra el nombre del usuario en la cabecera en vez de "Posts"
            //Si userName no existe, pone "Posts"
            options={({ route }) => ({ title: route.params?.userName ?? 'Posts' })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 55,
    marginBottom: 43
  }
})
