import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyD18jk9l_2K7ddH9mb4pS8OW4nAzLf-Q0Y',
  authDomain: 'pdf-sign-f02ce.firebaseapp.com',
  projectId: 'pdf-sign-f02ce',
  storageBucket: 'pdf-sign-f02ce.appspot.com',
  messagingSenderId: '653497815864',
  appId: '1:653497815864:web:fbed23afaa5affcc30a7cd',
  measurementId: 'G-CTRR31VCZF'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const storage = getStorage(app)
export const analytics = getAnalytics(app)
