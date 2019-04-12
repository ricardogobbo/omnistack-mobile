import React, { Component } from 'react';

import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

import ImagePicker from 'react-native-image-picker';

import api from '../../services/api';
import AsyncStorage from '@react-native-community/async-storage';

import { distanceInWords } from 'date-fns';
import pt from 'date-fns/locale/pt';

import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
 
import socket from 'socket.io-client';


import styles from './styles';
import logo from '../../assets/logo.png';

const CURRENT_BOX_ID = '@OmniBoxy:box';

export default class Box extends Component {
  
  state = {
    box: {},
  };

  async componentWillMount(){
    const id = await AsyncStorage.getItem(CURRENT_BOX_ID);
    this.subscribeToNewFiles(id);
    const response = await api.get(`boxes/${id}`)
    this.setState({box: response.data});
  }

  async componentDidMount() {
    
  }

  createNewBox = async () => {
    await AsyncStorage.removeItem(CURRENT_BOX_ID);
    this.props.navigation.navigate('Main');
  };

  

  

  openFile = async file => {
    try{
      const filePath = `${RNFS.DocumentDirectoryPath}/${file.title}`;

      await RNFS.downloadFile({
        fromUrl: file.url,
        toFile: filePath
      });

      await FileViewer.open(filePath);

    }catch(e){
      console.log("Unsupported file");
    }
  };

  renderItem = ({item}) => (
    <TouchableOpacity onPress={() => this.openFile(item)} style={styles.file}>
      <View style={styles.fileInfo}>
        <Icon name='insert-drive-file' size={24} color='#a34f3a'/>
        <Text style={styles.fileTitle}>{item.title}</Text>
        <Text style={styles.fileDate}> há {distanceInWords(item.createdAt, new Date(), {locale: pt})}</Text>
      </View>
    </TouchableOpacity>
  );

  handleUpload = async () => {
    ImagePicker.launchImageLibrary({}, async upload =>{
      if(upload.error){
        console.log("Erro ao selecionar imagem");
      }else if(upload.didCancel){
        console.log("Usuário Cancelou");
      }else{
        const data = new FormData();

        const [prefix, suffix] = upload.fileName.split(".")
        const ext = suffix.toLowerCase() === 'heic' ? 'jpg' : suffix;

        data.append('file', {
          uri: upload.uri,
          type: upload.type,
          name: `${prefix}.${ext}`
        });

        await api.post(`/boxes/${this.state.box._id}/files`, data);
      }
    });
  };

subscribeToNewFiles = (id) => {
  const io = socket('https://omnigobb.herokuapp.com')
  io.emit('connectRoom', id);
  io.on('file', data => {
    const box = this.state.box;
    box.files.push(data);
    this.setState({box: box});
  });
}

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.logo} source={logo}/>
        <Text style={styles.boxTitle}>{this.state.box.title}</Text>
        <TouchableOpacity style={styles.button} onPress={this.createNewBox}>
          <Text style={styles.buttonText}>Nova Box</Text>
        </TouchableOpacity>

        <FlatList style={styles.list}
            data={this.state.box.files}
            keyExtractor={file => file._id}
            ItemSeparatorComponent={() => <View style={styles.separator}/>}
            renderItem={this.renderItem}
        />
        <TouchableOpacity style={styles.fab} onPress={this.handleUpload}>
          <Icon name='cloud-upload' size={24} color="#fff"/>
        </TouchableOpacity>
      </View>
    );
  }
}
