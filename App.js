/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  PermissionsAndroid,
} from 'react-native';
import CallDetectorManager from 'react-native-call-detection';
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      featureOn: false,
      incoming: false,
      number: null,
    };
  }
  componentDidMount() {
    this.askPermission();
  }

  askPermission = async () => {
    try {
      const permissions = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
      ]);
      console.log('Permissions are: ', permissions);
    } catch (err) {
      console.warn(err);
    }
  };

  startListenerTapped = () => {
    this.setState({featureOn: true});
    this.callDetector = new CallDetectorManager(
      (event, number) => {
        console.log('event: ', event);
        if (event === 'Dialing') {
          // La llamada se ha marcado // solo IOS
          this.setState({incoming: false, number: null});
        } else if (event === 'Connected') {
          // la llamada se conectó // solo IOS
          this.setState({incoming: false, number: null});
        } else if (event === 'Disconnected') {
          // la llamada se desconectó
          this.setState({incoming: false, number: null});
        } else if (event === 'Incoming') {
          // Llamada entrante
          this.setState({incoming: true, number});
        } else if (event === 'Offhook') {
          // Estado de la llamada del dispositivo: descolgado.
          // Existe al menos una llamada que está marcando,
          // activo o en espera,
          // y no hay llamadas sonando o esperando.
          // solo ANDROID
          this.setState({incoming: true, number});
        } else if (event === 'Missed') {
          // Se perdió la llamada // solo ANDROID
          this.setState({incoming: false, number: null});
        }
      },
      true, // si desea leer el número de teléfono de la llamada entrante [ANDROID], de lo contrario es falso
      () => {}, // devolución de llamada si su permiso fue denegado [ANDROID] [solo si desea leer el número entrante] predeterminado: console.error
      {
        title: 'Phone State Permission',
        message:
          'This app needs access to your phone state in order to react and/or to adapt to incoming calls.',
      }, // a custom permission request message to explain to your user, why you need the permission [recommended] - this is the default one
    );
  };
  stopListenerTapped = () => {
    this.setState({featureOn: false});
    this.callDetector && this.callDetector.dispose();
  };
  render() {
    return (
      <View style={styles.body}>
        <Text style={styles.text}>¿Debería estar activada la detección?</Text>
        <TouchableHighlight
          onPress={
            this.state.featureOn
              ? this.stopListenerTapped
              : this.startListenerTapped
          }>
          <View
            style={{
              width: 200,
              height: 200,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: this.state.featureOn ? 'greenyellow' : 'red',
            }}>
            <Text style={styles.text}>
              {this.state.featureOn ? 'ON' : 'OFF'}{' '}
            </Text>
          </View>
        </TouchableHighlight>
        {this.state.incoming && (
          <Text style={{fontSize: 50}}>Incoming {this.state.number}</Text>
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  body: {
    backgroundColor: 'honeydew',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  text: {
    padding: 20,
    fontSize: 20,
  },
});
