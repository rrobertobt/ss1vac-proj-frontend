export const specialtiesApi = {
  list: () => $api<
    Array<{ id: number; name: string; description: string }>
  >('/specialties'),
  create: (data: { name: string; description: string }) => $api('/specialties', {
    method: 'POST',
    body: data,
  }),
  update: (id: number, data: { name: string; description: string }) => $api(`/specialties/${id}`, {
    method: 'PATCH',
    body: data,
  }),
  delete: (id: number) => $api(`/specialties/${id}`, {
    method: 'DELETE',
  }),
}