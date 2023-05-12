export const PATHS = {
  ROOT: "gs://share-profit-dapp.appspot.com",
  projectImage: ({ projectId, fileName }: { projectId: string, fileName: string }) => `/projects/${projectId}/projectImage/${fileName}`,
  sbtImage: ({ projectId, fileName }: { projectId: string, fileName: string }) => `/projects/${projectId}/sbtImage/${fileName}`
}