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