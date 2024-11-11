import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#FFD7D7',
    padding: 20,
    alignItems: 'center',
    position: 'relative',
  },
  hamburgerMenu: {
    position: 'absolute',
    left: 20,
    top: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subHeaderText: {
    fontSize: 14,
    color: 'gray',
  },
  scrollContainer: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    marginBottom: 10,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 14,
    color: 'gray',
  },
  statusContainer: {
    backgroundColor: '#000',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  
  statusText: {
    color: 'white',
    fontWeight: 'bold',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 15,
    backgroundColor: '#FF6A6A',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawerContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 250,
    backgroundColor: 'white',
    paddingTop: 40,
    elevation: 10,
  },
  drawerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  profileContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  drawerProfileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  drawerUserName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  drawerUserId: {
    fontSize: 14,
    color: 'gray',
  },
  drawerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  drawerLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center', // This centers the content vertically
    alignItems: 'center',     // This centers the content horizontally
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Slight background overlay for modal
  },
  loaderContainer: {
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 10, 
  },
  modalText: {
    marginTop: 10,
    fontSize: 16,
    color: '#FF6A6A',
  },
  rejectionReason: {
    backgroundColor: '#f8d7da', 
    color: '#721c24',            
    padding: 10,                 
    borderRadius: 5,             
    fontSize: 14,                
    fontWeight: 'bold',         
    marginTop: 5,               
    marginBottom: 5,            
    textAlign: 'center',         
  },
});

export default styles;
