import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  contentContainer: {
    padding: 16,
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
  },
  textInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 12,
  },
  itemContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
  },
  itemText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  actions: {
    flexDirection: 'row',
  },
  iconButton: {
    backgroundColor: '#007bff',
    padding: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
  },
  inlineEditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8, // Add spacing between the item and inline edit section
  },
  inlineEditInput: {
    flex: 1, // Allow input to take up remaining space
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginRight: 8, // Space between input and buttons
  },
  inlineEditButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginLeft: 4, // Space between buttons
  },
  inlineEditCancelButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginLeft: 4, // Space between buttons
  },
  
  saveButton: {
    marginLeft: 8,
    backgroundColor: '#28a745',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  cancelButton: {
    marginLeft: 8,
    backgroundColor: '#ff4d4d',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default styles;
