import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ff7f7f',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#f7f7f7',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff7f7f',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backButtonContainer: {
    paddingRight: 10, // Adjust spacing between back button and text
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1, // Make sure text is centered
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginVertical: 10,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowInput: {
    flex: 1,
    marginHorizontal: 5,
  },
  label: {
    fontSize: 18,
    fontWeight: '500',
    color: '#555',
    marginTop: 15,
    marginBottom: 5,
  },
  dropdownWrapper: {
    zIndex: 1, // Adjust zIndex dynamically on each dropdown
  },
  dropdown: {
    borderColor: '#ccc',
    height: 50,
    borderRadius: 8,
    marginVertical: 10,
    paddingHorizontal: 10,
    justifyContent: 'center',
    zIndex: 1000,
  },
  dropdownContainer: {
    borderColor: '#ccc',
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#ff7f7f',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  backButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    flex: 0.45,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#ff7f7f',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    flex: 0.45,
  },
  imageButton: {
    backgroundColor: '#ff7f7f',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    width: '100%',
    alignSelf: 'center',
  },
  imageButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  selectedImagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  selectedImage: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 8,
  },
});

export default styles;