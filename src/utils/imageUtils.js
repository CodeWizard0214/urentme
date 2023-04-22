/// remove prefix like 'data:image/jpeg;base64,' or 'data:image/png;base64,'
export const getImageBase64Data = (data) => {
  return data.slice(data.indexOf(',') + 1);
}