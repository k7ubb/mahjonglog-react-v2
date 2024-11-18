import {
	getFirestore,
	collection,
	doc,
	getDocs,
	setDoc,
	query,
	where,
} from 'firebase/firestore';
import {
	getAuth,
	createUserWithEmailAndPassword,
	onAuthStateChanged,
} from 'firebase/auth';
import { FirebaseApp } from '../lib/firebase';

export const checkAccountIDExist = async (accountID: string) => {
	const docs = (
		await getDocs(
			query(
				collection(getFirestore(FirebaseApp), 'account'),
				where('accountID', '==', accountID)
			)
		)
	).docs;
	if (docs.length !== 0) {
		throw new Error('このアカウントIDは使われています');
	}
};

export const registerAccount = async ({
	email,
	password,
	accountID,
	accountName,
}: {
	email: string;
	password: string;
	accountID: string;
	accountName: string;
}) => {
	await createUserWithEmailAndPassword(getAuth(), email, password);
	const auth = getAuth();
	onAuthStateChanged(auth, async (user) => {
		if (!user) {
			throw new Error('アカウント登録に失敗しました');
		}
		await setDoc(doc(getFirestore(FirebaseApp), 'account', user.uid), {
			email,
			accountID,
			accountName,
		});
	});
};
