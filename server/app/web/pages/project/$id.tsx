import React from 'react';
import { connect } from 'dva';
import { Project } from 'models/project';

interface ProjectDetailProps {
  dispatch: any,
  match: any,
  projectDetail?: Project;
};

@connect(({ project }) => {
  return {
    projectDetail: project.current,
  }
})
class ProjectDetail extends React.Component<ProjectDetailProps> {
  componentDidMount() {
    const { dispatch, match } = this.props;

    dispatch({
      type: 'project/enterProject',
      payload: {
        projectId: match.params.id,
      },
    });
  }

  render() {
    const { projectDetail } = this.props;
    if (!projectDetail) return null;

    return <div>
      <h1>{projectDetail.projectTitle}</h1>
      <p>Last updated at {projectDetail.updatedAt}</p>
    </div>;
  }
}

export default ProjectDetail;