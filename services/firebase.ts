import Firebase from "firebase/app";
import config from "config";
import "firebase/firestore";

if (!Firebase.apps.length) {
  const configuration = JSON.parse(config.get("firebase.config"));
  Firebase.initializeApp(configuration);
}

export const firebase = Firebase;
export const db = firebase.firestore();

export const COLLECTIONS = {
  projects: "projects",
  experiences: "experiences",
};

export const dbCollection = (collection: keyof typeof COLLECTIONS) => {
  return db.collection(collection);
};
