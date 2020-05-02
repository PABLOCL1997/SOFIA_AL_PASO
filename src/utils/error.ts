export const getError = (error: any) => {
    return [...error.graphQLErrors, ...[error.networkError]].map(({ message }: any, i: number) => (
        `${message}`
    )).join('<br />')
}