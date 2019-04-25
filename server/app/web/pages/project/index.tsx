import React from 'react';
import { Button, Modal, Form, Input, List, Popconfirm, Icon  } from 'antd';
import router from 'umi/router';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { connect } from 'dva';
import { Project as ProjectType } from 'models/project';
import dayjs from 'dayjs';

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

  handleDeleteProject = (projectId: string) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'project/deleteProject',
      payload: {
        projectId,
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
          <List.Item
            actions={[(
              <Popconfirm title="Are you sure？" icon={<Icon type="question-circle-o" style={{ color: 'red' }}/>} onConfirm={() => this.handleDeleteProject(item._id)}>
                <Button type="danger">Delete</Button>
              </Popconfirm>
            )]}
          >
            <List.Item.Meta
              title={<div style={{ cursor: 'pointer' }} onClick={() => router.push(`/project/${item._id}`)}>{item.projectTitle}</div>}
              description={dayjs(item.createdAt).format('YYYY-MM-DD hh:mm:ss')}
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