const mongoose = require('mongoose');
const FacilitiSchema = mongoose.Schema({
  hotelObj: { type: Object },
  airconditioner: { type: Number, default: 0 },
  television: { type: Number, default: 0 },
  internet: { type: Number, default: 0 },
  beddingSet: { type: Number, default: 0 },
  dryer: { type: Number, default: 0 },
  cableTelevision: { type: Number, default: 0 },
  washingMachine: { type: Number, default: 0 },
  cloth: { type: Number, default: 0 },
  flatIron: { type: Number, default: 0 },
  shampoo: { type: Number, default: 0 },
  smartKey: { type: Number, default: 0 },
  coffeeMaker: { type: Number, default: 0 },
  teaMaker: { type: Number, default: 0 },
  tea: { type: Number, default: 0 },
  coffee: { type: Number, default: 0 },
  freeBreakfast: { type: Number, default: 0 },
  kitchen: { type: Number, default: 0 },
  smokeAlarmSensor: { type: Number, default: 0 },
  fireExtinguisher: { type: Number, default: 0 },
  firstAidKit: { type: Number, default: 0 },
  coAlarm: { type: Number, default: 0 }
}, {
  timestamps: true
});
module.exports = mongoose.model('Facilities', FacilitiSchema);
