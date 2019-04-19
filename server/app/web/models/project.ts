import { queryProject, addProject } from '@/services/api';

interface Project {
  name: string,
}

export default {
  namespace: 'project',

  state: {
    list: [] as Array<Project>,
  },

  effects: {
    *fetchProjectList(_, { call, put }) {
      const res = yield call(queryProject);

      yield put({
        type: 'updateList',
        payload: Array.isArray(res.data) ? res.data : [],
      })
    },

    *createProject({ payload: { projectName } }, { call, put }) {
      const res = yield call(addProject, { name: projectName });

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
    }
  },
}