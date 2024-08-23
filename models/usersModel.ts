import mongoose from "mongoose";

const { Schema } = mongoose;

const usersSchema = new Schema({
  name: { type: String, requiere: [true, "A user must have a name"] },
  employNumber: { type: String, requiere: [true, "A user must have an employ number"] },
  email: { type: String, requiere: [true, "A user must have an email"] },
  phoneNumber: { type: String, requiere: [true, "A user must have a phone number"] },
  enterprise: {type: Schema.Types.ObjectId,
    ref: 'Enterprise',
    required: [true, "A user must be associated with an enterprise"]
  },
  department: {type: Schema.Types.ObjectId,
    ref: 'Department',
    required: [true, "A user must be associated with a department"]
  },
  seniority: {type: Schema.Types.ObjectId,
    ref: 'Seniority',
    required: [true, "A user must be associated with a seniority"]
  },
  holiday: {type: Schema.Types.ObjectId,
    ref: 'Holiday',
    required: [true, "A user must be associated with a holiday"]
  },
});


const UsersModel = mongoose.model("Users", usersSchema);

export default UsersModel;
