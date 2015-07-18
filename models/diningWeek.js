'use strict';
var mongoose = require('mongoose');

var diningWeekSchema = mongoose.Schema({
   Sunday: {
      Acomm: {
         required: true,
         type: String
      },
      menu: {
         required: true,
         type: String
      },
      latePlates: {
         required: false,
         type: [String],
         default: []
      }
   },
   Monday: {
      Acomm: {
         required: true,
         type: String
      },
      menu: {
         required: true,
         type: String
      },
      latePlates: {
         required: false,
         type: [String],
         default: []
      }
   },
   Tuesday: {
      Acomm: {
         required: true,
         type: String
      },
      menu: {
         required: true,
         type: String
      },
      latePlates: {
         required: false,
         type: [String],
         default: []
      }
   },
   Wednesday: {
      Acomm: {
         required: true,
         type: String
      },
      menu: {
         required: true,
         type: String
      },
      latePlates: {
         required: false,
         type: [String],
         default: []
      }
   },
   Thursday: {
      Acomm: {
         required: true,
         type: String
      },
      menu: {
         required: true,
         type: String
      },
      latePlates: {
         required: false,
         type: [String],
         default: []
      }
   }
});

module.exports = mongoose.model('DiningWeek', diningWeekSchema);