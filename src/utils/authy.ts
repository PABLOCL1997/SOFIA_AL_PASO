import axios from "axios";

const authyUrl = "https://tienda.sofia.com.bo/api/v1/authy";

const start = async (cellphone: string, email: string): Promise<string | undefined> => {
    try {

        const register = await axios.post(`${authyUrl}/register`, {
            country_code: "591",
            cellphone,
            email
        })
        if (!register.data.user.id) {
            throw new Error()
        }

        await axios.post(`${authyUrl}/start/${register.data.user.id}`)
        return String(register.data.user.id);
    } catch (error) {
        // showError()
        console.error('start::', error)
    }
}

const verify = async (authyId: string, token: string) => {
    try {
        await axios.post(`${authyUrl}/verify`, {
            authyId,
            token
        })
        return true
    } catch (error) {
        console.error('verify::', error);
        return false
    }
}


export {
    start,
    verify
}