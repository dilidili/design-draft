import { queryProjectList, addProject, deleteProject, queryProjectDetail } from '@/services/api';
import { Draft } from './draft';

export interface Project {
  projectTitle: string,
  createdAt: string,
  updatedAt: string,
  _id: string,
  drafts: Array<Draft>,
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
    },

    addDraft(state, action) {
      return {
        ...state,
        current: {
          ...state.current,
          drafts: [...state.current.drafts, ...action.payload],
        },
      }
    },

    removeDraft(state, action) {
      return {
        ...state,
        current: {
          ...state.current,
          drafts: state.current.drafts.filter(draft => draft._id !== action.payload),
        },
      }
    },

    updateDraft(state, action: { payload: { draftId: string, content: Draft } }) {
      return {
        ...state,
        current: {
          ...state.current,
          drafts: state.current.drafts.map(draft => {
            if (draft._id === action.payload.draftId) {
              return {
                ...draft,
                ...action.payload.content,
              };
            } else {
              return draft;
            }
          }),
        },
      }
    },
  },
}