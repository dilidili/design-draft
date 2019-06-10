import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Draft } from 'models/draft';


const DraftLoading = () => {
  return (
    <div>
      Loading
    </div>
  )
}

interface DraftOriginalProps {
  draft: Draft,
};
const DraftOriginal = (props: DraftOriginalProps) => {
  const { draft } = props;
  return <img src={draft.url} style={{ width: '40vw', }}/>
}

interface DraftDetailProps {
  match: any,
  dispatch: any,
  draftDetail: Draft,
};
const DraftDetail = (props: DraftDetailProps) => {
  const {
    match: {
      params: {
        id: draftId,
      }
    },
    dispatch,
    draftDetail,
  } = props;

  // fetch draft detail
  useEffect(() => {
    dispatch({
      type: 'draft/enterDraft',
      payload: {
        draftId: draftId,
      },
    });
  }, [draftId]);

  if (!draftDetail) return null;

  if (draftDetail.initializeWork.currentStep !== -1) {
    return <DraftLoading />
  }

  return <div>
    <DraftOriginal draft={draftDetail} />
  </div>;
}

export default connect(({ draft }) => {
  return {
    draftDetail: draft.current,
  };
})(DraftDetail);