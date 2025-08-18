import multer from "multer";
import path from "path";
import fs from "fs";

const profilePath = path.join(__dirname, "..", "uploads", "profileImages");
if (!fs.existsSync(profilePath)) {
  fs.mkdirSync(profilePath, { recursive: true });
}

const tripPath = path.join(__dirname, "..", "uploads", "tripImages");
if (!fs.existsSync(tripPath)) {
  fs.mkdirSync(tripPath, { recursive: true });
}

const countryPath = path.join(__dirname, "..", "uploads", "countryImages");
if (!fs.existsSync(countryPath)) {
  fs.mkdirSync(countryPath, { recursive: true });
}

const storageProfile = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, profilePath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const storageTrip = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tripPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const storageCountry = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, countryPath);
    console.log(countryPath)
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + countryPath);
  },
});

export const uploadProfileImage = multer({ storage: storageProfile });
export const uploadTripImages = multer({ storage: storageTrip });
export const uploadCountryImages = multer({ storage: storageCountry });
