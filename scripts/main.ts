import generateUUID from "../functions/generateUUID";
import { initializeApp } from "firebase/app";
import { doc, getFirestore, setDoc } from "firebase/firestore";
// This is a function that pulls data from neutricslice and adds to firebase

const firebaseConfig = {
  apiKey: "AIzaSyAk1dP4nkpFt_WSgJ3ZTlaV84f4NOtykJg",
  authDomain: "ubc-meal-hub.firebaseapp.com",
  projectId: "ubc-meal-hub",
  storageBucket: "ubc-meal-hub.appspot.com",
  messagingSenderId: "641900113874",
  appId: "1:641900113874:web:9eca9dbe6f12fd0637220b",
  measurementId: "G-RR95CN43NN"
};


async function main() {

  // Function to sync resturant data
  const result = await fetch('https://ubc.api.nutrislice.com/menu/api/weeks/school/ubc-open-kitchen/menu-type/open-kitchen-at-orchard-commons/2024/10/05/')
  if (!result.ok) {
    console.log("failed mark one")
    return
  }

  const data = await result.json()

  console.log(JSON.stringify(data))

  // TODO: Replace the following with your app's Firebase project configuration
  // See: https://support.google.com/firebase/answer/7015592
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);


  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);
  try {
    await setDoc(doc(db, "res", "LA"), {
      name: "Los Angeles",
      state: "CA",
      country: "USA"
    });
    for (let index = 0; index < data["days"][0]["menu_items"].length; index++) {
      console.log({
        food_id: generateUUID(),
        pretty: (data["days"][0]["menu_items"][index]["food"]["name"] as string).replace(/[[\s]/g, '-'),
        name: data["days"][0]["menu_items"][index]["food"]["name"],
        rating_sum: 0,
        rating_count: 0,
        hearts: [],
        ingredients: [],
        image: "",
        date: new Date().getTime(),
        restaurant_id: '4533b37b-d1a5-42a9-bea4-c9c50139eb3c',
        category: "Breakfast"
      })
    }
  } catch (error) {
    console.log("soemthing went wrong", error)
  }
}
main()