import api from '../utils/axios';

export async function getSliderImages() {
  const response = await api.get('/api/v1/sliders');
  return response.data?.data || [];
}

export async function uploadSliderImage(file) {
  const formData = new FormData();
  formData.append('image', file);

  const response = await api.post('/api/v1/admin/sliders', formData);

  return response.data?.data;
}

export async function deleteSliderImage(publicId) {
  const response = await api.delete('/api/v1/admin/sliders', {
    data: { publicId },
  });

  return response.data?.data;
}
