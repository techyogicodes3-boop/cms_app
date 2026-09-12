import api from './axios';

function filenameFromDisposition(disposition, fallbackName) {
  if (!disposition) return fallbackName;

  const encoded = disposition.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
  if (encoded) {
    try {
      return decodeURIComponent(encoded.replace(/^"|"$/g, ''));
    } catch {
      return fallbackName;
    }
  }

  return disposition.match(/filename="?([^";]+)"?/i)?.[1] || fallbackName;
}

export async function downloadAuthenticatedFile(url, fallbackName) {
  try {
    const response = await api.get(url, { responseType: 'blob' });
    const contentType = String(response.headers['content-type'] || '');
    if (contentType.includes('application/json')) {
      const payload = JSON.parse(await response.data.text());
      throw new Error(payload.message || payload.error || 'The report could not be generated.');
    }

    const filename = filenameFromDisposition(response.headers['content-disposition'], fallbackName);
    const objectUrl = URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    return filename;
  } catch (error) {
    if (error?.response?.data instanceof Blob) {
      try {
        const payload = JSON.parse(await error.response.data.text());
        throw new Error(payload.message || payload.error || 'The report could not be generated.');
      } catch (blobError) {
        if (blobError instanceof SyntaxError) throw error;
        throw blobError;
      }
    }
    throw error;
  }
}
