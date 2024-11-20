import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default styles;
