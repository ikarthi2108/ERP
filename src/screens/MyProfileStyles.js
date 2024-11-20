import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f3f3f3', // Lighter background for contrast
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff', // Changed background color for profile form
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
    paddingRight: 10,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111',
    flex: 1,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // Slight shadow effect
  },
  inputDisabled: {
    backgroundColor: '#e9ecef',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 15,
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2, // Subtle shadow for disabled input
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    borderRadius: 10, // Rounded corners for textarea
  },
  updateButton: {
    backgroundColor: '#ff7f7f',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // Button shadow for depth
  },
  updateButtonText: {
    color: '#111',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default styles;
