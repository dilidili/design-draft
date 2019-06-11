import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Draft } from 'models/draft';

// for REPL enviroment.
declare global {
  interface Window {
    React
  }
}
window.React = React;

// loading view.
const DraftLoading = () => {
  return (
    <div>
      Loading
    </div>
  )
}

// show original design.
interface DraftOriginalProps {
  draft: Draft,
};
const DraftOriginal = (props: DraftOriginalProps) => {
  const { draft } = props;
  return <img src={draft.url} style={{ width: '40vw', }}/>
}

// preview view.
interface DraftPreviewProps {
  draft: Draft,
}
const DraftPreview = (props: DraftPreviewProps) => {
  const { draft } = props;

  let children = null;
  if (draft.transformedCode) {
    children = eval(draft.transformedCode);
  }

  return (
    <div>{children}</div>
  )
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
    <DraftPreview draft={draftDetail} />
  </div>;
}

export default connect(({ draft }) => {
  return {
    draftDetail: draft.current,
  };
})(DraftDetail);