import { StyleSheet, Platform } from "react-native";

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? getStatusBarHeight() : 0,
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center'
  },

  logo: {
    alignSelf: 'center'
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    fontSize: 16,
    paddingHorizontal: 20,
    marginTop: 30,
  },

  button: {
    height: 56,
    backgroundColor: '#7159c1',
    borderRadius: 4,
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
  },

  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    alignSelf: 'center'
  }

});

export default styles;
