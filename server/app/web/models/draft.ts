import { addDraft, deleteDraft } from '@/services/api';

export interface Draft {
  draftName: string,
  createdAt: string,
  updatedAt: string,
  _id: string,
  url: string,
}

export default {
  namespace: 'draft',

  state: {},

  effects: {
    *createDraft({ payload: { urls, projectId } }, { call, put }) {
      const res = yield call(addDraft, { urls, projectId });

      yield put({
        type: 'project/addDraft',
        payload: res
      });

      return res;
    },

    *deleteDraft({ payload: { draftId } }, { call, put }) {
      const res = yield call(deleteDraft, { draftId });

      yield put({
        type: 'project/removeDraft',
        payload: draftId,
      });

      return res;
    },
  },

  reducers: {

  },
}