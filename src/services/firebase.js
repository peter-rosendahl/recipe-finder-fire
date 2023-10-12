import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from 'firebase/database';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useFirebaseAuth, getCurrentUser } from 'vuefire';
import { firebaseConfig } from './firebase-config';

export const firebaseApp = initializeApp(firebaseConfig);

const db = getDatabase(firebaseApp);

const auth = useFirebaseAuth();

export const signIn = async(email, password) => {
    return await signInWithEmailAndPassword(auth, email, password)
}

export const createMember = async(email, password, name) => {
    await createUserWithEmailAndPassword(auth, email, password)
        .then(credentials => {
            const data = {
                id: credentials.user.uid,
                name: name,
                recipeCount: 0
            };
            set(setRef(`members/${data.id}`), data);
        })
        .catch(error => {
            console.log('createMember error', error);
        })
}

export const getCurrentMember = async() => {
    const user = await getCurrentUser();
    if (user != null) {
        const snapshot = await get(ref(db, `members/${user.uid}`));
        if (snapshot != null) {
            return snapshot.val();
        }
    }
    return null;
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