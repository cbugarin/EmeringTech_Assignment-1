import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const studentSchema = new mongoose.Schema(
  {
    studentNumber: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, minlength: 6 },

    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },

    address: { type: String, default: "" },
    city: { type: String, default: "" },
    phoneNumber: { type: String, default: "" },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    program: { type: String, required: true, trim: true },

    // custom fields (requirement)
    favoriteTopic: { type: String, default: "" },
    strongestSkill: { type: String, default: "" },

    role: { type: String, enum: ["student", "admin"], default: "student" }
  },
  { timestamps: true }
);

studentSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

studentSchema.methods.matchesPassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

export default mongoose.model("Student", studentSchema);
