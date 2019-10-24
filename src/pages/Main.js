import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {
    View,
    SafeAreaView,
    Image,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import io from 'socket.io-client';

import api from '../services/api';

import logo from '../assets/logo.png';
import like from '../assets/like.png';
import dislike from '../assets/dislike.png';
import itsamatch from '../assets/itsamatch.png';

export default function Main({ navigation }) {

    const id = navigation.getParam('user');

    const [users, setUsers] = useState([]);
    const [matchDev, setMatchDev] = useState(null);

    useEffect(() => {
        async function loadUsers() {
            const response = await api.get('/devs', {
                headers: {
                    user: id,
                }
            });

            setUsers(response.data);
        }

        loadUsers();
    }, [id]);

    useEffect(() => {
        const socket = io('http://localhost:3333/', {
            query: { user: id }
        });

        socket.on('match', dev => {
            setMatchDev(dev);
        });
    }, [id]);

    async function handleLike() {
        const [user, ...rest] = users;

        await api.post(`/devs/${user._id}/likes`, null, {
            headers: {
                user: id
            }
        });

        setUsers(rest);
    };

    async function handleDislike() {
        const [user, ...rest] = users;

        await api.post(`/devs/${user._id}/dislikes`, null, {
            headers: {
                user: id
            }
        });

        setUsers(rest);
    };

    async function handleLogout() {
        await AsyncStorage.clear();
        navigation.navigate("Login");
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={handleLogout}>
                <Image
                    source={logo}
                    style={styles.logo}
                />
            </TouchableOpacity>
            <View style={styles.cardsContainer}>
                {users.length > 0 ? (
                    users.map((user, index) => (
                        <View key={user._id} style={[styles.card, { zIndex: users.length - index }]}>
                            <Image
                                style={styles.avatar}
                                source={{ uri: user.avatar }}
                            />
                            <View style={styles.footer}>
                                <Text style={styles.name}>{user.name}</Text>
                                <Text style={styles.bio}>{user.bio}</Text>
                            </View>
                        </View>
                    ))
                ) : (
                        <Text style={styles.emptyMessage}>
                            Nenhum resultado para ser exibido. :(
                        </Text>
                    )}

            </View>

            {users.length > 0 ? (
                <View style={[styles.buttonsContainer, { zIndex: 9998 }]}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleDislike}
                    >
                        <Image
                            source={dislike}
                            alt="Dislike"
                            style={styles.buttonImage}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleLike}
                    >
                        <Image
                            source={like}
                            alt="Like"
                            style={styles.buttonImage}
                        />
                    </TouchableOpacity>
                </View>
            ) : (
                    <View />
                )}

            {matchDev && (
                <View style={[styles.matchContainer, { zIndex: 9999 }]}>
                    <Image
                        source={itsamatch}
                        alt="It's a Match!"
                        style={styles.itsAMatch}
                    />
                    <Image
                        source={{ uri: matchDev.avatar }}
                        alt="Avatar"
                        style={styles.matchAvatar}
                    />
                    <Text style={styles.matchName}>{matchDev.name}</Text>
                    <Text style={styles.matchBio}>{matchDev.bio}</Text>

                    <TouchableOpacity onPress={() => setMatchDev(null)}>
                        <Text style={styles.closeMatch}>FECHAR</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    logo: {
        width: 140,
        height: 50,
        marginTop: 30
    },

    avatar: {
        flex: 1,
        height: 300
    },

    cardsContainer: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        maxHeight: 500
    },

    card: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        margin: 30,
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    },

    footer: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 15
    },

    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
    },

    bio: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#999',
        marginTop: 2,
        lineHeight: 18
    },

    buttonsContainer: {
        flexDirection: 'row',
        marginBottom: 30
    },

    button: {
        width: 70,
        height: 70,
        borderRadius: 25,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 2,
        shadowOffset: {
            width: 0,
            height: 2
        }
    },

    buttonImage: {
        width: 40,
        height: 40
    },

    emptyMessage: {
        fontSize: 20,
        color: '#999',
        fontWeight: 'bold',
        alignSelf: 'center'
    },

    matchContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center'
    },

    itsAMatch: {
        height: 60,
        resizeMode: 'contain'
    },

    matchAvatar: {
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 5,
        borderColor: '#FFF',
        marginVertical: 30
    },

    matchName: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#fff'
    },

    matchBio: {
        fontSize: 16,
        color: '#fff',
        lineHeight: 24,
        textAlign: 'center',
        marginTop: 10,
        paddingHorizontal: 30
    },

    closeMatch: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        marginTop: 30,
        fontWeight: 'bold'
    }
});