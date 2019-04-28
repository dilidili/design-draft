module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const DraftSchema = new Schema({
    draftName: { type: String },
    url: { type: String },
    
    project: { type: Schema.Types.ObjectId, ref: 'Project' },
  }, {
    timestamps: true,
  });

  return mongoose.model('Draft', DraftSchema);
}