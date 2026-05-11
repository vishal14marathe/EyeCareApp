import { db, storage } from "../firebase/firebse";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const COLLECTION_NAME = "landingPage";
const DOCUMENT_ID = "content";

export const getLandingPageData = async () => {
  try {
    const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No such document! Returning null.");
      return null;
    }
  } catch (error) {
    console.error("Error getting document:", error);
    throw error;
  }
};

export const subscribeToLandingPageData = (callback) => {
  const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
  return onSnapshot(docRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data());
    } else {
      callback(null);
    }
  });
};

export const updateLandingPageData = async (data) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
    await setDoc(docRef, data);
    return true;
  } catch (error) {
    console.error("Error updating document:", error);
    throw error;
  }
};

export const uploadImage = async (file) => {
  try {
    const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export const addCollection = async (newItem) => {
  try {
    const data = await getLandingPageData() || {};
    const collections = [...(data.collections || []), newItem];
    await updateLandingPageData({ ...data, collections });
    return true;
  } catch (error) {
    console.error("Error adding collection:", error);
    throw error;
  }
};

export const updateCollection = async (id, updatedCol) => {
  try {
    const data = await getLandingPageData() || {};
    const collections = (data.collections || []).map(c => c.id === id ? { ...c, ...updatedCol } : c);
    await updateLandingPageData({ ...data, collections });
    return true;
  } catch (error) {
    console.error("Error updating collection:", error);
    throw error;
  }
};

export const deleteCollection = async (id) => {
  try {
    const data = await getLandingPageData() || {};
    const collections = (data.collections || []).filter(c => c.id !== id);
    await updateLandingPageData({ ...data, collections });
    return true;
  } catch (error) {
    console.error("Error deleting collection:", error);
    throw error;
  }
};

export const addService = async (newItem) => {
  try {
    const data = await getLandingPageData() || {};
    const services = [...(data.services || []), newItem];
    await updateLandingPageData({ ...data, services });
    return true;
  } catch (error) {
    console.error("Error adding service:", error);
    throw error;
  }
};

export const updateService = async (id, updatedService) => {
  try {
    const data = await getLandingPageData() || {};
    const services = (data.services || []).map(s => s.id === id ? { ...s, ...updatedService } : s);
    await updateLandingPageData({ ...data, services });
    return true;
  } catch (error) {
    console.error("Error updating service:", error);
    throw error;
  }
};

export const deleteService = async (id) => {
  try {
    const data = await getLandingPageData() || {};
    const services = (data.services || []).filter(s => s.id !== id);
    await updateLandingPageData({ ...data, services });
    return true;
  } catch (error) {
    console.error("Error deleting service:", error);
    throw error;
  }
};
