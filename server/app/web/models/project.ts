import { queryProjectList, addProject } from '@/services/api';

export interface Project {
  projectTitle: string,
  createdAt: string,
  _id: string,
}

export default {
  namespace: 'project',

  state: {
    list: [] as Array<Project>,
  },

  effects: {
    *fetchProjectList(_, { call, put }) {
      const res = yield call(queryProjectList);

      yield put({
        type: 'updateList',
        payload: Array.isArray(res) ? res : [],
      })
    },

    *createProject({ payload: { projectName } }, { call, put }) {
      const res = yield call(addProject, { projectTitle: projectName });

      yield put({
        type: 'addProject',
        payload: res
      });

      return res;
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
    }
  },
}