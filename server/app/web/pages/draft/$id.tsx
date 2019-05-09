import React, { useEffect } from 'react';
import { connect } from 'dva';
import draft, { Draft } from 'models/draft';

interface DraftDetailProps {
  match: any,
  dispatch: any,
  draftDetail: Draft,
};

const DraftLoading = (props: { draft: Draft }) => {
  return (
    <div>
      Loading
    </div>
  )
}

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
    return <DraftLoading draft={draftDetail} />
  }

  return <div>TODO</div>;
}

export default connect(({ draft }) => {
  return {
    draftDetail: draft.current,
  };
})(DraftDetail);