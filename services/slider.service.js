import api from '../utils/axios';

export async function getSliderImages() {
  const response = await api.get('/api/v1/sliders');
  return response.data?.data || [];
}

export async function uploadSliderMedia(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/api/v1/admin/sliders', formData);

  return response.data?.data;
}

export async function replaceSliderMedia(id, file) {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.put(`/api/v1/admin/sliders/${encodeURIComponent(id)}`, formData);
  return response.data?.data;
}

export const uploadSliderImage = uploadSliderMedia;

export async function deleteSliderImage(publicId) {
  const response = await api.delete('/api/v1/admin/sliders', {
    data: { publicId },
  });

  return response.data?.data;
}
