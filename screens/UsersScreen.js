import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';
import axios from 'axios';

//Dirección de la api
const API_URL = 'https://jsonplaceholder.typicode.com/users';

export default function UsersScreen({ navigation }) {
    const [users, setUsers] = useState([]); //lista de usuarios
    const [loading, setLoading] = useState(true); //si está cargando
    const [error, setError] = useState(null); //si hay error

    //Función reutilizable: se usa al montar y en el botón "Recargar" (re-fetch)
    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            //Recibe la petición con un timeout de 10 segundos
            const res = await axios.get(API_URL, { timeout: 10000 });
            setUsers(res.data);
        } catch (e) {
            setError('Error al cargar datos');
        } finally {
            setLoading(false);
        }
    }, []);

    //Trae los usuarios automáticamente al abrir la página
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    //Estado: cargando
    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#d50032" />
                <Text style={styles.muted}>Cargando...</Text>
            </View>
        );
    }

    //Estado: error
    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.error}>{error}</Text>
                <TouchableOpacity style={styles.button} onPress={fetchUsers}>
                    <Text style={styles.buttonText}>Reintentar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    //Estado: datos
    return (
        <FlatList
            data={users}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.list}
            ListHeaderComponent={
                <View style={styles.header}>
                    <Text style={styles.counter}>Mostrando {users.length} usuarios</Text>
                    <TouchableOpacity style={styles.button} onPress={fetchUsers}>
                        <Text style={styles.buttonText}>Recargar</Text>
                    </TouchableOpacity>
                </View>
            }
            renderItem={({ item }) => (
                <TouchableOpacity
                    style={styles.card}
                    activeOpacity={0.7}
                    onPress={() =>
                        //Al pulsar una tarjeta navega a la pantalla de posts
                        //Pasa userId y userName como parámetros
                        navigation.navigate('Posts', { userId: item.id, userName: item.name })
                    }
                >
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.detail}>{item.email}</Text>
                    <Text style={styles.detail}>{item.address.city}</Text>
                </TouchableOpacity>
            )}
        />
    );
}

const styles = StyleSheet.create({
    center: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: 20 
    },

    list: { 
        padding: 12 
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },

    counter: { 
        fontSize: 14, 
        color: '#555' 
    },

    card: {
        backgroundColor: '#fff',
        padding: 14,
        marginVertical: 6,
        borderRadius: 10,
        //Sombra iOS
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        //Sombra Android
        elevation: 3,
    },

    name: { 
        fontWeight: 'bold', 
        fontSize: 16, 
        marginBottom: 4 
    },

    detail: { 
        color: '#444' 
    },

    muted: { 
        marginTop: 8, 
        color: '#666' 
    },

    error: { 
        color: 'red', 
        fontSize: 16, 
        marginBottom: 12 
    },

    button: {
        backgroundColor: '#d50032',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 6,
    },

    buttonText: { 
        color: '#fff', 
        fontWeight: 'bold'
    }
});