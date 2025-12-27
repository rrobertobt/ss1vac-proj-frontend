export const areasApi = {
  list: () => $api('/areas'),
  create: (data: { name: string; description: string }) => $api('/areas', {
    method: 'POST',
    body: data,
  }),
  update: (id: number, data: { name: string; description: string }) => $api(`/areas/${id}`, {
    method: 'PATCH',
    body: data,
  }),
  delete: (id: number) => $api(`/areas/${id}`, {
    method: 'DELETE',
  }),
}