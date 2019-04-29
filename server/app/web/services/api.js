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