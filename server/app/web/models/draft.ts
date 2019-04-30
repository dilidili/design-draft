import { addDraft, deleteDraft, updateDraft } from '@/services/api';

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

    *changeDraftName({ payload: { draftId, draftName } }, { call, put }) {
      if (!draftName) return;

      const res = yield call(updateDraft, draftId, { draftName });

      yield put({
        type: 'project/updateDraft',
        payload: {
          draftId,
          content: {
            draftName,
            updatedAt: res.updatedAt,
          },
        }
      })
    }
  },

  reducers: {

  },
}