import React, { Component } from 'react';

import { Text, View, Image, TextInput, TouchableOpacity } from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import api from '../../services/api';

import styles from './styles';
import logo from '../../assets/logo.png';

const CURRENT_BOX_ID = '@OmniBoxy:box';

export default class Main extends Component {

  state = {
    newBox: ''
  }

  async componentWillMount(){
    const box = await AsyncStorage.getItem(CURRENT_BOX_ID);
    if(box){
      this.props.navigation.navigate('Box')  
    }
  }

  handleSignIn = async () => {
    const res = await api.post('boxes', {title: this.state.newBox});
    //res.data._id;
    await AsyncStorage.setItem(CURRENT_BOX_ID, '5cae753cd7221c001728a3a9');

    this.props.navigation.navigate('Box')
  }

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.logo} source={logo}/>
        <TextInput
          style={styles.input}
          placeholder='Digite o nome da Box'
          placeholderTextColor='#777'
          autoCapitalize='none'
          autoCorrect={false}
          underlineColorAndroid='transparent'
          value={this.state.newBox}
          onChangeText={text => this.setState({newBox: text})}
        />
        <TouchableOpacity
            onPress={this.handleSignIn}
            style={styles.button}>
          <Text style={styles.buttonText}>Criar</Text>
        </TouchableOpacity>

      </View>
    );
  }
}
