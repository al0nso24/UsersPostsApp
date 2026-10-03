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

export default function PostsScreen({ route }) {
    //Recibe route como prop
    //Se extrae userId de los parámetros de UsersScreen
    const { userId } = route.params;
    const [posts, setPosts] = useState([]); //lista de posts
    const [loading, setLoading] = useState(true); //si está cargando
    const [error, setError] = useState(null); //si hay error

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            //Axios arma el query string: ?userId={id}
            const res = await axios.get('https://jsonplaceholder.typicode.com/posts', {
                params: { userId },
                timeout: 10000,
            });
            setPosts(res.data);
        } catch (e) {
            setError('Error al cargar datos');
        } finally {
            setLoading(false);
        }
    }, [userId]); //muestra los posts en base al id del usuario

    //Muestra las publicaciones automáticamente al cargar la página
    //Si userId cambia, también vuelve a ejecutar la petición
    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#d50032" />
                <Text style={styles.muted}>Cargando...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.error}>{error}</Text>
                <TouchableOpacity style={styles.button} onPress={fetchPosts}>
                    <Text style={styles.buttonText}>Reintentar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <FlatList
            data={posts}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.list}
            ListHeaderComponent={
                <View style={styles.header}>
                    <Text style={styles.counter}>Mostrando {posts.length} publicaciones</Text>
                    <TouchableOpacity style={styles.button} onPress={fetchPosts}>
                        <Text style={styles.buttonText}>Recargar</Text>
                    </TouchableOpacity>
                </View>
            }
            ListEmptyComponent={
                <Text style={styles.muted}>Este usuario no tiene publicaciones.</Text>
            }
            renderItem={({ item }) => (
                <View style={styles.card}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.body}>{item.body}</Text>
                </View>
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
        backgroundColor: '#e6f7ff',
        padding: 14,
        marginVertical: 6,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },

    title: { 
        fontWeight: 'bold', 
        marginBottom: 6, 
        textTransform: 'capitalize' 
    },

    body: { 
        color: '#333', 
        lineHeight: 20 
    },

    muted: { 
        marginTop: 8, 
        color: '#666' 
    },

    error: { color: 'red', 
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