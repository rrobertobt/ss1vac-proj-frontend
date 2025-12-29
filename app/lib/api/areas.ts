export const areasApi = {
  list: () => $api<
    Array<{ id: number; name: string; description: string }>
  >('/areas'),
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