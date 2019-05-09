module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const WorkSchema = new Schema({
    type: { type: String },
    currentStep: {
      type: Number,
      default: 0,
    },
    currentStepDescription: {
      type: String,
      default: '',
    },
    totalSteps: { type: Number, default: 0 },
    draft: { type: Schema.Types.ObjectId, ref: 'Draft' },
  }, {
    timestamps: true,
  });

  return mongoose.model('Work', WorkSchema);
}