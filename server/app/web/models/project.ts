import { queryProjectList, addProject, deleteProject, queryProjectDetail } from '@/services/api';
import project from 'pages/project';

export interface Project {
  projectTitle: string,
  createdAt: string,
  updatedAt: string,
  _id: string,
}

export default {
  namespace: 'project',

  state: {
    list: [] as Array<Project>,
    current: null as Project,
  },

  effects: {
    *fetchProjectList(_, { call, put }) {
      const res = yield call(queryProjectList);

      yield put({
        type: 'updateList',
        payload: Array.isArray(res) ? res : [],
      })
    },

    *enterProject({ payload: { projectId } }, { call, put }) {
      const res = yield call(queryProjectDetail, { projectId });

      yield put({
        type: 'updateProjectDetail',
        payload: res,
      })
    },

    *createProject({ payload: { projectName } }, { call, put }) {
      const res = yield call(addProject, { projectTitle: projectName });

      yield put({
        type: 'addProject',
        payload: res
      });

      return res;
    },

    *deleteProject({ payload: { projectId } }, { call, put }) {
      yield call(deleteProject, { projectId, })

      yield put({
        type: 'removeProject',
        payload: projectId,
      })
    }
  },

  reducers: {
    updateList(state, action) {
      return {
        ...state,
        list: action.payload,
      }
    },

    addProject(state, action) {
      return {
        ...state,
        list: [action.payload, ...state.list],
      }
    },

    updateProjectDetail(state, action) {
      return {
        ...state,
        current: action.payload,
      }
    },

    removeProject(state, action) {
      return {
        ...state,
        list: state.list.filter(project => project._id !== action.payload),
      }
    }
  },
}