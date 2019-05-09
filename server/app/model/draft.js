module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const DraftSchema = new Schema({
    draftName: { type: String },
    url: { type: String },

    initializeWork: { type: Schema.Types.ObjectId, ref: 'Work' },

    project: { type: Schema.Types.ObjectId, ref: 'Project' },
  }, {
    timestamps: true,
  });

  DraftSchema.methods.isInitialized = function() {
    return !!this.initializeWork;
  };

  return mongoose.model('Draft', DraftSchema);
}