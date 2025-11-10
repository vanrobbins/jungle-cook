// FirebaseService: class wrapper around firebase functionality so app can
// instantiate or import a singleton and call methods from controllers.
import { app } from "./firebaseConfig";
import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	GoogleAuthProvider,
	signInWithPopup,
	signOut,
	onAuthStateChanged,
	updateProfile,
} from "firebase/auth";
class FirebaseService {
	constructor() {
		this.app = null;
		this.auth = null;
		this._onAuthChanged = null; // user callback
		this._initialized = false;
	}

	init() {
		if (this._initialized) return this;
		this.app = app;
		this.auth = getAuth(this.app);
		// internal listener: forward to user callback if set
		onAuthStateChanged(this.auth, (user) => {
			if (typeof this._onAuthChanged === "function") {
				try {
					this._onAuthChanged(user);
				} catch (e) {
					console.error("onAuthChanged callback error:", e);
				}
			}
			// default console log for debug
			if (user) {
				console.log("User:", user.email, "is signed in");
			} else {
				console.log("No user signed in");
			}
		});
		this._initialized = true;
		return this;
	}

	// Allow app code to register an auth-state callback
	onAuthStateChanged(cb) {
		this._onAuthChanged = cb;
		// ensure initialized so we get events
		if (!this._initialized) this.init();
	}

	// Auth actions
	loginWithEmail(email, password) {
		if (!this.auth) this.init();
		return signInWithEmailAndPassword(this.auth, email, password);
	}

	signupWithEmail(email, password) {
		if (!this.auth) this.init();
		return createUserWithEmailAndPassword(this.auth, email, password);
	}

	signInWithGoogle() {
		if (!this.auth) this.init();
		const provider = new GoogleAuthProvider();
		return signInWithPopup(this.auth, provider);
	}

	signOutUser() {
		if (!this.auth) this.init();
		return signOut(this.auth);
	}

	// Update the currently signed-in user's display name (username)
	changeUsername(newDisplayName) {
		if (!this.auth) this.init();
		const user = this.auth.currentUser;
		if (!user) {
			return Promise.reject(new Error("No authenticated user to update"));
		}
		return updateProfile(user, { displayName: newDisplayName })
			.then(() => {
				console.log("User displayName updated to", newDisplayName);
				// notify any auth-change listener with the updated user
				if (typeof this._onAuthChanged === "function") {
					this._onAuthChanged(this.auth.currentUser);
				}
				return this.auth.currentUser;
			})
			.catch((err) => {
				console.error("Failed to update displayName:", err);
				throw err;
			});
	}
}

export const firebaseService = new FirebaseService();
export default firebaseService;
