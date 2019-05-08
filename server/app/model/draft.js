module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const DraftSchema = new Schema({
    draftName: { type: String },
    url: { type: String },

    initilizeWork: { type: Schema.Types.ObjectId, ref: 'Work' },

    project: { type: Schema.Types.ObjectId, ref: 'Project' },
  }, {
    timestamps: true,
  });

  DraftSchema.methods.isInitialized = function() {
    return !!this.initilizeWork;
  };

  return mongoose.model('Draft', DraftSchema);
}