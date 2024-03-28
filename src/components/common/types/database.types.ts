import mongo from "@/assets/logos/mongodb.svg";
import firestore from "@/assets/logos/firestore.svg";

enum SupportedDatabases {
  MONGO = "mongoDB",
  FIRESTORE = "firestore",
}

const DatabaseIcons = {
  [SupportedDatabases.MONGO]: mongo,
  [SupportedDatabases.FIRESTORE]: firestore,
};

const SupportedDBArray = Object.values(SupportedDatabases);

export { SupportedDatabases, DatabaseIcons, SupportedDBArray };
