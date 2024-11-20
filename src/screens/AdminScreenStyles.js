// AdminScreenStyles.js
import { StyleSheet } from 'react-native';

const AdminScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f3f3',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: -250,
    width: 250,
    height: '100%',
    backgroundColor: '#fff',
    padding: 20,
    zIndex: 2,
  },
  sidebarTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 20,
  },
  sidebarButton: {
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  sidebarButtonText: {
    color: '#111',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f7afaf',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  menuIconContainer: {
    paddingRight: 10,
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
    
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  contentContainer: {
    padding: 16,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#444',
  },
  noRequests: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#888',
  },
  details: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  requestId: {
    fontSize: 16,
    color: '#f57c00',
    fontWeight: 'bold',
  },
  CityName:{
    fontSize: 16,
    color: '#3d00f5',
    fontWeight: 'bold',
  },
  companyName: {
    fontSize: 16,
    color: '#00796b',
    fontWeight: 'bold',
  },
  reasonContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#f07575',
    borderRadius: 4,
  },
  reasonText: {
    fontSize: 12,
    color: '#333',
  },
  statusContainer: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 10,
    marginTop: 4,
  },
  status: {
    fontSize: 12,
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    width: 150,
    height: 150,
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalText: {
    marginTop: 10,
    fontSize: 16,
    color: '#FF6A6A',
    textAlign: 'center',
  },
});

export default AdminScreenStyles;
