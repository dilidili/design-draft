import request from '@/utils/request';

export async function queryProjectList() {
  return request('/api/projects/');
}

export async function addProject({ projectTitle }) {
  return request('/api/projects', {
    method: 'POST',
    data: {
      projectTitle,
    }
  });
}

export async function deleteProject({ projectId }) {
  return request(`/api/projects/${projectId}`, {
    method: 'DELETE',
  });
}

export async function queryProjectDetail({ projectId }) {
  return request(`/api/projects/${projectId}`, {
    method: 'GET',
  });
}

export async function queryDraftDetail({ draftId }) {
  return request(`/api/drafts/${draftId}`, {
    method: 'GET',
  });
}

export async function addDraft({ projectId, urls }) {
  return request('/api/drafts', {
    method: 'POST',
    data: {
      projectId,
      urls,
    }
  });
}

export async function deleteDraft({ draftId }) {
  return request(`/api/drafts/${draftId}`, {
    method: 'DELETE',
  });
}

export async function updateDraft(draftId, { draftName }) {
  return request(`/api/drafts/${draftId}`, {
    method: 'PUT',
    data: {
      draftName,
    }
  });
}

export async function queryBabelCode({ code }) {
  return request('/api/babel', {
    method: 'POST',
    data: {
      code,
    }
  });
}