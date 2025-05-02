import mongoose from "mongoose";

const { Schema } = mongoose;

const symptomSchema = new Schema({
  name: { type: String, required: true },
});
const Symptom =
  mongoose.models.Symptom || mongoose.model("Symptom", symptomSchema);
export { Symptom };
