import React from 'react';
import { Button, Modal, Form, Input } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';

interface ProjectProps {
  form: WrappedFormUtils,
}

class Project extends React.Component<ProjectProps> {
  state = {
    showCreateProjectModal: false,
  }

  onCreateProject = () => {

  }

  renderCreateProjectForm() {
    const {
      form: {
        getFieldDecorator,
      }
    } = this.props;

    return (
      <div>
        {getFieldDecorator('projectName', {
          rules: [{
            required: true,
            message: 'Please input project name!'
          }],
        })(
          <Input placeholder="project name" />
        )}
      </div>
    )
  }

  render() {
    const {
      showCreateProjectModal,
    } = this.state;

    return (
      <div>
        <Button onClick={() => this.setState({ showCreateProjectModal: true })}>create project</Button>
        <Modal
          title="create project"
          visible={showCreateProjectModal}
          onOk={this.onCreateProject}
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

const WrappedProject = Form.create({ name: 'create_project_form' })(Project);

export default WrappedProject;