const mongoose = require('mongoose');
const RoomDetailSchema = mongoose.Schema({
    hotelObj: {type: Object},
    accommodates: {type: Number, default: 1},
    bathRooms: {type: Number, default: 1},
    bedRooms: {type: Number, default: 1},
    maxDay: {type: Number, default: 1},
    promotion: {type: Number, default: 0},
    price: {type: String, default: 0},
    lstImg:{type: String },
    bedroomDetail: {type: Array},
    roomType: {type: Number, default: 1},
    roomAirConditional: {type: Boolean, default: true},
    roomHairdryer: {type: Boolean, default: true},
    roomIroningMachine: {type: Boolean, default: true},
    roomTelevison: {type: Boolean, default: true},
    roomCableTV: {type: Boolean, default: true},
    roomFreeWifi: {type: Boolean, default: true},
    roomTea: {type: Boolean, default: true},
    roomCoffee: {type: Boolean, default: true},
    roomShampoo: {type: Boolean, default: true},
    roomBeddingSet: {type: Boolean, default: true},
    roomTowelsOfAllKinds: {type: Boolean, default: true},
    roomWardrobe: {type: Boolean, default: true},
    roomPrivatePool: {type: Boolean, default: true},
    roomHeaters: {type: Boolean, default: true},
    roomDryer: {type: Boolean, default: true},
    roomTeaMaker: {type: Boolean, default: true},
    roomSmartKey: {type: Boolean, default: true},
    roomFreeBreakfast: {type: Boolean, default: true},
    roomWorkspace: {type: Boolean, default: true},
    roomFireplace: {type: Boolean, default: true},
    roomHotTub: {type: Boolean, default: true},
}, {
    timestamps: true
});
module.exports = mongoose.model('RoomDetails', RoomDetailSchema);
