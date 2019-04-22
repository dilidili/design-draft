import React from 'react';
import { Button, Modal, Form, Input, List } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { connect } from 'dva';
import { Project as ProjectType } from 'models/project';

interface ProjectProps {
  form: WrappedFormUtils,
  dispatch: any,
  createProjectLoading: boolean,
  projectList: Array<ProjectType>,
}

@connect(({ project, loading }) => ({
  projectList: project.list,
  createProjectLoading: loading.effects['project/createProject'],
}))
class Project extends React.Component<ProjectProps> {
  state = {
    showCreateProjectModal: false,
  }

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'project/fetchProjectList',
    })
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

  renderProjectList() {
    const { projectList } = this.props;

    return (
      <List
        itemLayout="horizontal"
        dataSource={projectList}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              title={<div>{item.projectTitle}</div>}
            />
          </List.Item>
        )}
      />
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

        {this.renderProjectList()}
      </div>
    )
  }
}

export default Form.create({ name: 'create_project_form' })(Project);