import React from 'react';
import { connect } from 'dva';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { Project } from 'models/project';
import { Button, Modal, Form, Input, Upload, Icon } from 'antd';

interface ProjectDetailProps {
  form: WrappedFormUtils,
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
  state = {
    showCreateDraftModal: false,
  }

  componentDidMount() {
    const { dispatch, match } = this.props;

    dispatch({
      type: 'project/enterProject',
      payload: {
        projectId: match.params.id,
      },
    });
  }

  normFile(e) {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }

  handleCreateDraft = () => {
    const { form, dispatch, projectDetail } = this.props;

    form.validateFields((errs, values) => {
      if (!errs && projectDetail) {
        dispatch({
          type: 'draft/createDraft',
          payload: {
            urls: values.draftImage.map(v => v.response.url),
            projectId: projectDetail._id,
          },
        });

        this.setState({
          showCreateDraftModal: false,
        });
      }
    })
  }

  renderCreateDraftModal() {
    const { showCreateDraftModal } = this.state;
    const {
      form: {
        getFieldDecorator,
      }
    } = this.props;

    return (
      <Modal
        visible={showCreateDraftModal}
        onOk={this.handleCreateDraft}
        title="Create draft"
      >
        <Form>
          <Form.Item>
            {getFieldDecorator('draftImage', {
              valuePropName: 'file',
              getValueFromEvent: this.normFile,
            })(
              <Upload name="draft" action="/api/oss/objects" listType="picture">
                <Button>
                  <Icon type="upload" /> Click to upload
                </Button>
              </Upload>
            )}
          </Form.Item>
        </Form>
      </Modal>
    )
  }

  render() {
    const { projectDetail } = this.props;
    if (!projectDetail) return null;

    return <div>
      <h1>{projectDetail.projectTitle}</h1>
      <p>Last updated at {projectDetail.updatedAt}</p>

      <Button onClick={() => this.setState({ showCreateDraftModal: true })}>Create Draft</Button>

      {this.renderCreateDraftModal()}
    </div>;
  }
}

export default Form.create({ name: 'project_detail' })(ProjectDetail);