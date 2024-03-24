import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set } from 'firebase/database';
import { sendPasswordResetEmail, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import store from '../store'
import { useFirebaseAuth, getCurrentUser } from 'vuefire';
import { firebaseConfig } from './firebase-config';
import moment from 'moment';

export const firebaseApp = initializeApp(firebaseConfig);

const db = getDatabase(firebaseApp);

const auth = useFirebaseAuth();

export const signIn = async(email, password) => {
    return await signInWithEmailAndPassword(auth, email, password)
}

export const createMember = (email, password, name) => {
    console.log('firebase.createMember', email, password, name);
    createUserWithEmailAndPassword(auth, email, password)
        .then(async (credentials) => {
            console.log('firebase.createMember result', credentials);
            const data = {
                id: credentials.user.uid,
                name: name,
                recipeCount: 0,
                createdAt: moment(credentials.user.metadata.creationTime).format('DD. MMMM YYYY'),
            };
            console.log('firebase.createMember data', data);
            await set(setRef(`members/${data.id}`), data);
            store.dispatch('auth/setMember', data);
        })
        .catch(error => {
            console.log('createMember error', error);
            throw error;
        })
}

export const getCurrentMember = async() => {
    var user = await getCurrentUser();
    if (user != null) {
        console.log('firebase current member', user);
        const memberData = await getMemberById(user.uid);
        const userData = await extractCurrentMemberData(user);
        return {
            ...memberData, 
            ...userData
        }   
    }
    return null;
}

export const extractCurrentMemberData = (user) => {
    return {
        createdAt: moment(user.metadata.creationTime).format('DD. MMMM YYYY'),
        isVerified: user.emailVerified,
        loginType: user.providerData[0].providerId
    }
}

export const getMemberById = async(uid) => {
    const snapshot = await get(ref(db, `members/${uid}`));
    if (snapshot != null) {
        return snapshot.val();
    }
}

export const updateProfile = async(data) => {

}

export const sendResetPasswordRequest = async(email) => {
    return await sendPasswordResetEmail(auth, email);
}

export const logout = async() => {
    return await signOut(auth);
}

/**
 * Recipe List from database
 */
export const recipeRef = ref(db, 'recipes');

/**
 * Member List from database
 */
export const memberRef = ref(db, 'members');

/**
 * Ingredient List from database
 */
export const ingredientRef = ref(db, 'ingredients');

export const setRef = (path) => {
    return ref(db, path);
}