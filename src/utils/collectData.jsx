export const collectData = (data, index) => {
  const result = data.map((v) => v[index]);
  return result;
};
