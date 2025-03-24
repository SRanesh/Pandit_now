import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  updateDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { auth, db, collections } from '../lib/firebase';
import type { User } from '../types/auth';

class FirebaseAuthService {
  private currentUser: User | null = null;
  private listeners: ((user: User | null) => void)[] = [];

  private async createUserDocument(firebaseUser: FirebaseUser, userData: Partial<User>) {
    const userRef = doc(db, collections.users, firebaseUser.uid);
    const userDoc = {
      id: firebaseUser.uid || '',
      email: firebaseUser.email || '',
      name: userData.name || firebaseUser.displayName || '',
      role: userData.role || 'user',
      disabled: false,
      profile: userData.profile || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Use merge option to prevent overwriting existing data
    await setDoc(userRef, userDoc, { merge: true });
    return userDoc as User;
  }

  constructor() {
    // Set up auth state listener
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, collections.users, firebaseUser.uid));
          let userData: User | null = null;
          
          if (userDoc.exists()) {
            userData = userDoc.data() as User;
          } else {
            // Create user document if it doesn't exist
            userData = await this.createUserDocument(firebaseUser, {
              name: firebaseUser.displayName || '',
              email: firebaseUser.email || '',
              role: 'user'
            });
          }
          
          this.currentUser = userData;
          this.notifyListeners(userData);
        } catch (error) {
          console.error('Error fetching user data:', error);
          this.currentUser = null;
          this.notifyListeners(null);
        }
      } else {
        this.currentUser = null;
        this.notifyListeners(null);
      }
    });
  }

  onAuthStateChanged(callback: (user: User | null) => void) {
    this.listeners.push(callback);
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  private notifyListeners(user: User | null) {
    this.listeners.forEach(listener => listener(user));
  }

  async register(name: string, email: string, password: string, role: 'user' | 'pandit' = 'user', profile?: any) {
    try {
      // Check if email already exists
      const usersRef = collection(db, collections.users);
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        throw new Error('Email already in use');
      }

      // Create auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { user: firebaseUser } = userCredential;

      // Update display name
      await updateProfile(firebaseUser, { displayName: name });
      await updateProfile(firebaseUser, { 
        displayName: name,
        photoURL: profile?.avatarUrl || null
      });

      // Create user document with profile
      const userData = {
        email,
        name,
        role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        profile: role === 'pandit' ? {
          languages: profile?.languages || ['Hindi', 'Sanskrit'],
          specializations: profile?.specializations || ['Puja', 'Wedding Ceremony'],
          experience: profile?.experience || '0',
          phone: profile?.phone || '',
          location: profile?.location || '',
          avatarUrl: profile?.avatarUrl || '',
          bio: profile?.bio || '',
          specializationCosts: {},
          rating: 0,
          reviewCount: 0
        } : {
          avatarUrl: profile?.avatarUrl || '',
          phone: profile?.phone || '',
          location: profile?.location || ''
        }
      };
      
      const userDoc = await this.createUserDocument(firebaseUser, userData);
      this.currentUser = userDoc;
      this.notifyListeners(userDoc);

      return userDoc;
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('Email already in use');
      }
      throw error;
    }
  }

  async login(email: string, password: string) {
    try {
      const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);
      
      // Wait for auth state to settle
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const userDoc = await getDoc(doc(db, collections.users, firebaseUser.uid));
      
      if (!userDoc.exists()) {
        // Create user document if it doesn't exist
        const userData = await this.createUserDocument(firebaseUser, {
          name: firebaseUser.displayName || '',
          email: firebaseUser.email || '',
          role: 'user'
        });
        this.currentUser = userData;
        this.notifyListeners(userData);
        return userData;
      }

      const userData = userDoc.data() as User;
      if (userData.disabled) {
        await signOut(auth);
        throw new Error('Account is disabled');
      }

      this.currentUser = userData;
      this.notifyListeners(userData);
      return userData;
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.code === 'auth/invalid-credential') {
        throw new Error('Invalid email or password');
      }
      throw error;
    }
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  async updateProfile(userId: string, data: Partial<User>) {
    const userRef = doc(db, collections.users, userId);
    await updateDoc(userRef, data);
    
    const updatedDoc = await getDoc(userRef);
    const updatedUser = updatedDoc.data() as User;
    this.currentUser = updatedUser;
    return updatedUser;
  }

  async logout() {
    await signOut(auth);
    this.currentUser = null;
    this.notifyListeners(null);
  }

  async disableUser(userId: string): Promise<void> {
    const userRef = doc(db, collections.users, userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    await updateDoc(userRef, {
      disabled: !userDoc.data().disabled
    });
  }

  async getStoredUsers() {
    const usersRef = collection(db, collections.users);
    const snapshot = await getDocs(usersRef);
    return snapshot.docs.map(doc => doc.data());
  }
}

export const firebaseAuthService = new FirebaseAuthService();