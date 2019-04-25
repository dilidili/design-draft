module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const ProjectSchema = new Schema({
    projectTitle: { type: String },
  }, {
    timestamps: true,
  });

  return mongoose.model('Project', ProjectSchema);
}