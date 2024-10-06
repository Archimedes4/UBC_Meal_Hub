"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var generateUUID_1 = require("../functions/generateUUID");
var app_1 = require("firebase/app");
var firestore_1 = require("firebase/firestore");
// This is a function that pulls data from neutricslice and adds to firebase
var firebaseConfig = {
    apiKey: "AIzaSyAk1dP4nkpFt_WSgJ3ZTlaV84f4NOtykJg",
    authDomain: "ubc-meal-hub.firebaseapp.com",
    projectId: "ubc-meal-hub",
    storageBucket: "ubc-meal-hub.appspot.com",
    messagingSenderId: "641900113874",
    appId: "1:641900113874:web:9eca9dbe6f12fd0637220b",
    measurementId: "G-RR95CN43NN"
};
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var result, data, app, db, index, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch('https://ubc.api.nutrislice.com/menu/api/weeks/school/ubc-open-kitchen/menu-type/open-kitchen-at-orchard-commons/2024/10/05/')];
                case 1:
                    result = _a.sent();
                    if (!result.ok) {
                        console.log("failed mark one");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, result.json()];
                case 2:
                    data = _a.sent();
                    console.log(JSON.stringify(data));
                    app = (0, app_1.initializeApp)(firebaseConfig);
                    db = (0, firestore_1.getFirestore)(app);
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, (0, firestore_1.setDoc)((0, firestore_1.doc)(db, "res", "LA"), {
                            name: "Los Angeles",
                            state: "CA",
                            country: "USA"
                        })];
                case 4:
                    _a.sent();
                    for (index = 0; index < data["days"][0]["menu_items"].length; index++) {
                        console.log({
                            food_id: (0, generateUUID_1.default)(),
                            pretty: data["days"][0]["menu_items"][index]["food"]["name"].replace(/[[\s]/g, '-'),
                            name: data["days"][0]["menu_items"][index]["food"]["name"],
                            rating_sum: 0,
                            rating_count: 0,
                            hearts: [],
                            ingredients: [],
                            image: "",
                            date: new Date().getTime(),
                            restaurant_id: '4533b37b-d1a5-42a9-bea4-c9c50139eb3c',
                            category: "Breakfast"
                        });
                    }
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    console.log("soemthing went wrong", error_1);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
main();
