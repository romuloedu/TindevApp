import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Image,
    Text,
    TextInput,
    TouchableOpacity
} from 'react-native';

import api from '../services/api';

import logo from '../assets/logo.png';

export default function Login({ navigation }) {

    // Pega o nome do usuário informado.
    const [user, setUser] = useState('');

    useEffect(() => {
        AsyncStorage.getItem('user').then(user => {
            if (user) {
                navigation.navigate("Main", { user });
            }
        })
    }, []);

    async function handleLogin() {

        // Checa a existência do usuário.
        const response = await api.post('/devs', {
            username: user
        })

        // Pega o ID do mesmo.
        const { _id } = response.data;

        await AsyncStorage.setItem('user', _id);
        navigation.navigate('Main', { user: _id });
    }

    return (
        <KeyboardAvoidingView
            behavior="padding"
            enabled={Platform.OS === "ios"}
            style={styles.container}
        >
            <Image
                source={logo}
                style={styles.logo}
            />

            <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Digite o seu usuário do Github"
                placeholderTextColor="#999"
                style={styles.input}
                value={user}
                onChangeText={setUser}>
            </TextInput>

            <TouchableOpacity
                style={styles.button}
                onPress={handleLogin}
            >
                <Text style={styles.buttonText}>Enviar</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30
    },

    logo: {
        width: 140,
        height: 50
    },

    input: {
        height: 46,
        alignSelf: 'stretch',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        marginTop: 20,
        paddingHorizontal: 15
    },

    button: {
        height: 46,
        alignSelf: 'stretch',
        backgroundColor: '#df4723',
        borderRadius: 4,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    },
});