const query = new Map(location.search.replace('?', '').split('&').map(q => q.split('=')) as any)
export const API_TOKEN = query.get('token') as string
if(!API_TOKEN) {
    throw new Error("No API token found")
}

export const triggerId = query.get('triggerId') as string
if(!triggerId) {
    throw new Error("No triggerId found")
}

