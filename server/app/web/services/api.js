import request from '@/utils/request';

export async function queryProject() {
  return request('/api/project/');
}

export async function addProject({ name }) {
  return request('/api/projects', {
    method: 'POST',
    data: {
      name,
    }
  });
}