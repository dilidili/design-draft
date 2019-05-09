import React, { useState } from 'react';
import { connect } from 'dva';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import router from 'umi/router';
import { Project } from 'models/project';
import { Button, Modal, Form, List, Upload, Icon, Avatar, Popconfirm, Input } from 'antd';
import dayjs from 'dayjs';

const DraftNameInput = (props: { initialValue: string, draftId: string, dispatch: Function }) => {
  const { initialValue, dispatch, draftId } = props;
  const [isInputMode, setInputMode] = useState(false);

  return isInputMode ? (
    <Input
      autoFocus
      defaultValue={initialValue}
      onClick={evt => evt.stopPropagation()}
      onBlur={(evt) => {
        evt.stopPropagation();

        dispatch({
          type: 'draft/changeDraftName',
          payload: {
            draftId,
            draftName: evt.target.value,
          },
        });

        setInputMode(false);
      }}
    />
  ) : (
    <div
      onClick={(evt) => {
        evt.stopPropagation();
        setInputMode(true);
      }}
    >
      {initialValue}
    </div>
  );
}

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

  handleDeleteDraft = (draftId: string) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'draft/deleteDraft',
      payload: {
        draftId,
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

  renderDraftList() {
    const { projectDetail, dispatch } = this.props;

    return (
      <List
        itemLayout="horizontal"
        dataSource={projectDetail.drafts}
        renderItem={item => (
          <List.Item
            onClick={() => router.push(`/draft/${item._id}`)}
            actions={[(
              <div onClick={evt => evt.stopPropagation()}>
                <Popconfirm title="Are you sure？" icon={<Icon type="question-circle-o" style={{ color: 'red' }}/>} onConfirm={() => this.handleDeleteDraft(item._id)}>
                  <Button type="danger" >Delete</Button>
                </Popconfirm>
              </div>
            )]}
          >
            <List.Item.Meta
              title={<div style={{ cursor: 'pointer'}}><DraftNameInput initialValue={item.draftName} draftId={item._id} dispatch={dispatch} /></div>}
              avatar={<Avatar src={item.url} />}
              description={dayjs(item.updatedAt).format('YYYY-MM-DD hh:mm:ss')}
            />
          </List.Item>
        )}
      />
    )
  }

  render() {
    const { projectDetail } = this.props;
    if (!projectDetail) return null;

    return <div>
      <h1>{projectDetail.projectTitle}</h1>
      <p>Last updated at {projectDetail.updatedAt}</p>

      <Button onClick={() => this.setState({ showCreateDraftModal: true })}>Create Draft</Button>

      {this.renderDraftList()}

      {this.renderCreateDraftModal()}
    </div>;
  }
}

export default Form.create({ name: 'project_detail' })(ProjectDetail);