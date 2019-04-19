import React from 'react';
import { Button, Modal, Form, Input } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { connect } from 'dva';

interface ProjectProps {
  form: WrappedFormUtils,
  dispatch: any,
  createProjectLoading: boolean,
}

@connect(({ project, loading }) => ({
  projectList: project.list,
  createProjectLoading: loading.effects['project/createProject'],
}))
class Project extends React.Component<ProjectProps> {
  state = {
    showCreateProjectModal: false,
  }

  handleSubmit = () => {
    const { dispatch, form } = this.props;

    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'project/createProject',
          payload: {
            ...values,
          }
        }).then(() => {
          this.props.form.resetFields();
          this.setState({ showCreateProjectModal: false });
        })
      }
    })
  }

  renderCreateProjectForm() {
    const {
      form: {
        getFieldDecorator,
      }
    } = this.props;

    return (
      <div>
        <Form>
          <Form.Item>
            {getFieldDecorator('projectName', {
              rules: [{
                required: true,
                message: 'Please input project name!'
              }],
            })(
              <Input placeholder="project name" />
            )}
          </Form.Item>
        </Form>
      </div>
    )
  }

  render() {
    const {
      showCreateProjectModal,
    } = this.state;
    const {
      createProjectLoading,
    } = this.props;

    return (
      <div>
        <Button onClick={() => this.setState({ showCreateProjectModal: true })} loading={createProjectLoading}>create project</Button>
        <Modal
          title="create project"
          visible={showCreateProjectModal}
          onOk={this.handleSubmit}
          onCancel={() => {
            this.props.form.resetFields();
            this.setState({ showCreateProjectModal: false });
          }}
        >
          {this.renderCreateProjectForm()}
        </Modal>
      </div>
    )
  }
}

export default Form.create({ name: 'create_project_form' })(Project);