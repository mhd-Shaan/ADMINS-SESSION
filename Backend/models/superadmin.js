import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Create a SuperAdmin Schema
const adminsschema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin','superadmin'],
    default: 'admin',
  },
  isblock:{
    type:Boolean,
    default:false
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

const admins = mongoose.model('admins',adminsschema)

export default admins
